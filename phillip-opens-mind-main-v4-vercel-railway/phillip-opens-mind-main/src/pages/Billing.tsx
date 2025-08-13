import React from 'react';

export default function Billing() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string|undefined>();
  const userId = React.useMemo(()=> localStorage.getItem('userId') || 'anon', []);

  async function buy() {
    try {
      setLoading(true); setError(undefined);
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else setError(data?.error || 'Unable to start checkout');
    } catch (e: any) {
      setError(e?.message || 'error');
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Buy Credits</h1>
      <p className="text-gray-600">Purchase a pack of credits to continue chatting.</p>
      <button className="px-4 py-2 rounded-xl bg-black text-white" onClick={buy} disabled={loading}>
        {loading ? 'Redirecting...' : 'Buy credit pack'}
      </button>
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
}
