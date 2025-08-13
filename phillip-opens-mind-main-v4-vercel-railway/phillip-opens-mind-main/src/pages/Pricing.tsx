import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const packs = [
  { id: "1k", tokens: "1,000", price: "$5", amountCents: 500 },
  { id: "5k", tokens: "5,000", price: "$20", amountCents: 2000 },
  { id: "20k", tokens: "20,000", price: "$70", amountCents: 7000 },
];

const Pricing = () => {
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Buy tokens – Phillip";
  }, []);

  const buy = (id: string) => {
    const pack = packs.find((p) => p.id === id);
    toast({
      title: `Enable payments to buy ${pack?.tokens} tokens`,
      description:
        "Connect Supabase, set your Stripe secret in an Edge Function, and I’ll wire this button to open Stripe Checkout.",
    });
  };

  return (
    <main className="container mx-auto py-12">
      <section className="text-center mb-10">
        <h1 className="text-3xl font-semibold">Simple, flexible token packs</h1>
        <p className="text-muted-foreground">Your first evaluation is free. One-time purchases for continued conversations.</p>
      </section>
      <section className="grid gap-6 md:grid-cols-3">
        {packs.map((p) => (
          <div key={p.id} className="border rounded-lg p-6 bg-card">
            <div className="text-sm text-muted-foreground">Pack</div>
            <div className="text-2xl font-semibold">{p.tokens} tokens</div>
            <div className="mt-2 text-lg">{p.price}</div>
            <Button onClick={() => buy(p.id)} className="mt-6 w-full" variant="hero">Buy tokens</Button>
          </div>
        ))}
      </section>
      <p className="mt-8 text-sm text-muted-foreground">
        After payment, you’ll be redirected back here. Your token balance will update automatically.
      </p>
    </main>
  );
};

export default Pricing;
