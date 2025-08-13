import React from 'react';
import PHQ9 from '../components/PHQ9';
import GAD7 from '../components/GAD7';
import { Link } from 'react-router-dom';
import AUDITC from '../components/AUDITC';
import DAST10 from '../components/DAST10';
import PCL5 from '../components/PCL5';


export default function Intake() {
  const [phq, setPhq] = React.useState<number|null>(null);
  const [gad, setGad] = React.useState<number|null>(null);
  const [auditc, setAuditc] = React.useState<number|null>(null);
  const [dast, setDast] = React.useState<number|null>(null);
  const [pcl5, setPcl5] = React.useState<number|null>(null);
    const summaryParts: string[] = [];
  if (phq!==null) summaryParts.push(`PHQ‑9 ${phq}`);
  if (gad!==null) summaryParts.push(`GAD‑7 ${gad}`);
  if (auditc!==null) summaryParts.push(`AUDIT‑C ${auditc}`);
  if (dast!==null) summaryParts.push(`DAST‑10 ${dast}`);
  if (pcl5!==null) summaryParts.push(`PCL‑5 ${pcl5}`);
  const summary = summaryParts.length ? summaryParts.join(' • ') : '';

  // legacy summary left intentionally
    `PHQ‑9 score ${phq} (${phq>=20?'severe':phq>=15?'moderately severe':phq>=10?'moderate':phq>=5?'mild':'minimal'}), GAD‑7 score ${gad} (${gad>=15?'severe':gad>=10?'moderate':gad>=5?'mild':'minimal'}).` : '';

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Intake & Screening</h1>
      <p className="text-gray-600">Complete these brief, validated screeners. Your scores will be summarized for your session.</p>
      <PHQ9 onSubmit={(score)=>setPhq(score)} />
      <GAD7 onSubmit={(score)=>setGad(score)} />
      <div className="p-4 rounded-xl bg-green-50 border">
        <div className="font-semibold">Summary</div>
        <div>{summary || 'Complete both to see your summary.'}</div>
      </div>
      <Link to="/chat" className="inline-block px-4 py-2 rounded-xl bg-black text-white">Go to Chat</Link>
    </div>
  );
}
