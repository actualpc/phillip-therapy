import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import OpenAI from 'openai';
import type { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat/completions';
import fs from 'fs';
import path from 'path';
import Stripe from 'stripe';

const app = express();
app.get('/health', (_, res) => res.json({ ok: true }));
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

const stripeSecret = process.env.STRIPE_SECRET_KEY || '';
const stripePriceId = process.env.STRIPE_PRICE_ID || '';
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2024-06-20' }) : null;

// ===== In-memory credits (replace with DB in production) =====
type User = { id: string; credits: number };
const USERS = new Map<string, User>();
function getUser(userId: string): User {
  if (!USERS.has(userId)) USERS.set(userId, { id: userId, credits: Number(process.env.INITIAL_CREDITS || 3) });
  return USERS.get(userId)!;
}
function consumeCredit(userId: string): boolean {
  const u = getUser(userId);
  if (u.credits <= 0) return false;
  u.credits -= 1;
  return true;
}

// ===== Safety: basic PHI scrubbing (emails, phones, SSNs, addresses patterns) =====
function scrubPHI(text: string): string {
  return text
    // email
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
    // phone (naive)
    .replace(/\b(\+?\d{1,2}[ -]?)?\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}\b/g, '[redacted-phone]')
    // SSN
    .replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[redacted-ssn]')
    // street numbers
    .replace(/\b\d{1,5}\s+([A-Za-z0-9'.\-]+\s?){1,4}\b/g, '[redacted-address]');
}

// ===== Audit logging =====
const auditPath = path.join(process.cwd(), 'audit.log');
function logAudit(event: any) {
  try {
    fs.appendFileSync(auditPath, JSON.stringify({ ts: new Date().toISOString(), ...event }) + '\n');
  } catch {}
}

// ===== Crisis detection =====
const CRISIS_TERMS = ['suicide','kill myself','harm myself','self-harm','overdose','kill someone','hurt someone','end it all'];

const SYSTEM_PROMPT = `You are "Phillip", a warm, evidence-informed mental health AI.
- Be supportive, concise, and non-judgmental.
- Ask clarifying questions when helpful.
- Never claim to be a human or licensed clinician.
- Include brief psychoeducation when appropriate.
- Avoid diagnosing; suggest possibilities and next steps.
- If you detect imminent risk (suicide/self-harm, harm to others, severe medical emergency), respond with a crisis safety message and urge contacting local emergency services or hotlines immediately.`;

const ChatSchema = z.object({
  userId: z.string().min(1),
  messages: z.array(z.object({
    role: z.enum(['system','user','assistant']),
    content: z.string()
  })).min(1),
  mode: z.enum(['general','evaluation']).default('general'),
  provider: z.enum(['openai']).default('openai'),
  model: z.string().default(process.env.OPENAI_MODEL || 'gpt-4o-mini'),
  stream: z.boolean().optional().default(false)
});

// ===== Provider clients =====
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function runOpenAIChat(model: string, messages: {role:'system'|'user'|'assistant', content:string}[], stream=false) {
  if (stream) {
    const resp = await openai.chat.completions.create({
      model,
      temperature: 0.3,
      stream: true,
      messages
    });
    return resp;
  } else {
    const resp = await openai.chat.completions.create({
      model,
      temperature: 0.3,
      messages
    } as ChatCompletionCreateParamsNonStreaming);
    return resp;
  }
}

// ===== Non-streaming chat =====
app.post('/api/chat', async (req, res) => {
  try {
    const parsed = ChatSchema.parse(req.body);
    const { userId, messages, mode, provider, model } = parsed;

    const crisis = CRISIS_TERMS.some(t => messages.map(m=>m.content.toLowerCase()).join(' ').includes(t));
    const system = { role: 'system' as const, content: SYSTEM_PROMPT + (mode==='evaluation' ? '\nFocus on structured intake.' : '') };

    // consume a credit
    if (!consumeCredit(userId)) {
      return res.status(402).json({ error: 'out_of_credits' });
    }

    const cleaned = messages.map(m => ({ ...m, content: scrubPHI(m.content) }));
    const completion = await runOpenAIChat(model, [system, ...cleaned], false) as any;
    let reply = completion.choices?.[0]?.message?.content?.trim() || "I'm here. Can you tell me a bit more?";

    if (crisis) {
      reply = `I’m really glad you told me. Your safety is the most important thing right now. 
If you’re in immediate danger or think you might act on these thoughts, please call your local emergency number (like 911 in the U.S.) or go to the nearest emergency room.
You can also contact the 988 Suicide & Crisis Lifeline (call or text 988 in the U.S.). 
If you’d like, I can help you create a short safety plan and identify someone you trust to reach out to.`;
    }

    logAudit({ type: 'chat', userId, tokens_estimate: completion.usage?.total_tokens, crisis });
    res.json({ reply, crisis });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err?.message || String(err) });
  }
});

// ===== Streaming chat (SSE) =====
app.post('/api/chat/stream', async (req, res) => {
  try {
    const parsed = ChatSchema.parse(req.body);
    const { userId, messages, mode, provider, model } = parsed;

    if (!consumeCredit(userId)) {
      res.writeHead(402, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      });
      res.write(`event: error\ndata: ${JSON.stringify({ error: 'out_of_credits' })}\n\n`);
      return res.end();
    }

    const crisis = CRISIS_TERMS.some(t => messages.map(m=>m.content.toLowerCase()).join(' ').includes(t));
    const system = { role: 'system' as const, content: SYSTEM_PROMPT + (mode==='evaluation' ? '\nFocus on structured intake.' : '') };
    const cleaned = messages.map(m => ({ ...m, content: scrubPHI(m.content) }));

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    });

    if (crisis) {
      const crisisMsg = `I’m really glad you told me. Your safety is the most important thing right now. 
If you’re in immediate danger or think you might act on these thoughts, please call your local emergency number (like 911 in the U.S.) or go to the nearest emergency room.
You can also contact the 988 Suicide & Crisis Lifeline (call or text 988 in the U.S.).`;
      res.write(`data: ${JSON.stringify({ delta: crisisMsg })}\n\n`);
      return res.end();
    }

    const stream = await runOpenAIChat(model, [system, ...cleaned], true) as any;
    for await (const part of stream) {
      const delta = part.choices?.[0]?.delta?.content ?? '';
      if (delta) {
        res.write(`data: ${JSON.stringify({ delta })}\n\n`);
      }
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: any) {
    try {
      res.write(`event: error\ndata: ${JSON.stringify({ error: err?.message || 'stream_error' })}\n\n`);
    } catch {}
    res.end();
  }
});

// ===== Credits API =====
app.get('/api/credits', (req, res) => {
  const userId = (req.query.userId as string) || 'anon';
  const u = getUser(userId);
  res.json({ userId: u.id, credits: u.credits });
});

// ===== Stripe checkout session =====
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    if (!stripe || !stripePriceId) return res.status(400).json({ error: 'Stripe not configured' });
    const { userId } = req.body || {};
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: 'payment',
      success_url: process.env.CHECKOUT_SUCCESS_URL || 'http://localhost:5173/success',
      cancel_url: process.env.CHECKOUT_CANCEL_URL || 'http://localhost:5173/billing',
      metadata: { userId }
    });
    res.json({ url: session.url });
  } catch (e: any) {
    res.status(500).json({ error: e?.message || 'stripe_error' });
  }
});

// ===== Stripe webhook (increments credits) =====
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    if (!stripe) return res.status(400).send('Stripe not configured');
    const sig = req.headers['stripe-signature'] as string;
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
    if (event.type === 'checkout.session.completed') {
      const userId = (event.data.object as any).metadata?.userId || 'anon';
      const u = getUser(userId);
      u.credits += Number(process.env.CREDITS_PER_PURCHASE || 20);
      logAudit({ type: 'credits_added', userId, amount: process.env.CREDITS_PER_PURCHASE || 20 });
    }
    res.json({ received: true });
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
