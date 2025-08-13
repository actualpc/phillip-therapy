import React from 'react';

const QUESTIONS = [
  'How often do you have a drink containing alcohol?',
  'How many standard drinks containing alcohol do you have on a typical day?',
  'How often do you have six or more drinks on one occasion?'
];

// Scoring guidance:
// Q1: 0=Never, 1=Monthly or less, 2=2-4/mo, 3=2-3/wk, 4=4+/wk
// Q2: 0=1-2, 1=3-4, 2=5-6, 3=7-9, 4=10+
// Q3: 0=Never, 1=Less than monthly, 2=Monthly, 3=Weekly, 4=Daily or almost daily

type Props = { onSubmit: (score: number, answers: number[]) => void };

export default function AUDITC({ onSubmit }: Props) {
  const [answers, setAnswers] = React.useState<number[]>(Array(3).fill(0));
  const total = answers.reduce((a,b)=>a+b,0);
  const risk = total>=4 ? 'Positive (risky drinking)' : 'Negative';

  const optionsQ1 = ['Never','Monthly or less','2–4 times a month','2–3 times a week','4+ times a week'];
  const optionsQ2 = ['1–2','3–4','5–6','7–9','10+'];
  const optionsQ3 = ['Never','Less than monthly','Monthly','Weekly','Daily or almost daily'];

  return (
    <div className="space-y-4 p-4 rounded-xl border">
      <h2 className="text-xl font-semibold">AUDIT‑C (Alcohol Use)</h2>
      {QUESTIONS.map((q, i)=>{
        const options = i===0?optionsQ1:i===1?optionsQ2:optionsQ3;
        return (
          <div key={i} className="space-y-2">
            <div className="font-medium">{i+1}. {q}</div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {options.map((label, val)=>(
                <label key={val} className="flex items-center gap-2 p-2 rounded-lg border">
                  <input type="radio" name={`auditc-${i}`} checked={answers[i]===val} onChange={()=>{
                    const next=[...answers]; next[i]=val; setAnswers(next);
                  }}/>
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
      <div className="p-3 rounded-xl bg-gray-50 border">Score: <b>{total}</b> • Screen: <b>{risk}</b></div>
      <button className="px-4 py-2 rounded-xl bg-black text-white" onClick={()=>onSubmit(total, answers)}>Save AUDIT‑C</button>
    </div>
  );
}
