import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero-phillip.jpg";
import { Link } from "react-router-dom";

const Index = () => {
  useEffect(() => {
    document.title = "Phillip – AI Therapist for Mental Health Assessment";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Phillip is an AI therapist offering a free mental health check‑in, private chat, saved sessions, and token packs.");
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto grid gap-8 lg:grid-cols-2 items-center py-16">
        <div className="text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Phillip – AI therapist for mental health check‑ins
          </h1>
          <p className="text-lg text-muted-foreground max-w-prose">
            Start with a free, structured check‑in based on DSM-5 guidelines and common questionnaires. Phillip listens, asks clear questions, and summarizes first impressions. Private by design.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/chat?mode=evaluation"><Button variant="hero">Start free evaluation</Button></Link>
            <Link to="/chat"><Button variant="soft">Open chat</Button></Link>
            <Link to="/pricing"><Button variant="outline">Buy tokens</Button></Link>
          </div>
          <p className="text-sm text-muted-foreground">
            Disclaimer: Phillip is an AI and not a substitute for professional diagnosis or treatment. If you’re in crisis, contact local emergency services.
          </p>
        </div>
        <div className="relative">
          <img src={hero} alt="Calming illustration for Phillip, an AI therapist providing a gentle mental health check‑in" className="w-full h-auto rounded-lg shadow-xl" loading="lazy" />
        </div>
      </section>
    </main>
  );
};

export default Index;
