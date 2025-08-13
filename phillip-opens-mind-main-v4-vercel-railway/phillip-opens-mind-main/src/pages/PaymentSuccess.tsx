import { useEffect } from "react";

const PaymentSuccess = () => {
  useEffect(() => {
    document.title = "Payment successful – Phillip";
  }, []);

  return (
    <main className="min-h-[60vh] grid place-items-center">
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-semibold">Thank you!</h1>
        <p className="text-muted-foreground">Your payment was successful. Tokens will appear in your balance shortly.</p>
      </section>
    </main>
  );
};

export default PaymentSuccess;
