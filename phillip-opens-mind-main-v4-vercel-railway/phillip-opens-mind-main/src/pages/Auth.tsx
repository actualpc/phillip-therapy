import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    document.title = mode === "signin" ? "Sign in – Phillip" : "Create account – Phillip";
  }, [mode]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Connect Supabase to enable auth",
      description: "Use the Supabase integration to add secure email + password login.",
    });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] grid place-items-center">
      <section className="w-full max-w-md border rounded-lg p-6 bg-card">
        <h1 className="text-2xl font-semibold mb-2">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          {mode === "signin" ? "Sign in to continue your conversation with Phillip." : "Start your journey with a calm space to reflect."}
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required placeholder="you@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full">{mode === "signin" ? "Sign in" : "Create account"}</Button>
        </form>
        <div className="mt-4 text-sm text-muted-foreground">
          {mode === "signin" ? (
            <button className="underline" onClick={() => setMode("signup")}>No account? Create one</button>
          ) : (
            <button className="underline" onClick={() => setMode("signin")}>Already have an account? Sign in</button>
          )}
        </div>
      </section>
    </main>
  );
};

export default Auth;
