import { useEffect } from "react";

const PaymentCanceled = () => {
  useEffect(() => {
    document.title = "Payment canceled – Phillip";
  }, []);

  return (
    <main className="min-h-[60vh] grid place-items-center">
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-semibold">Payment canceled</h1>
        <p className="text-muted-foreground">No charges were made. You can try again anytime.</p>
      </section>
    </main>
  );
};

export default PaymentCanceled;
