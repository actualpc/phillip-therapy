import React from 'react';

const GAD7_QUESTIONS = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid, as if something awful might happen'
];

type Props = { onSubmit: (score: number, answers: number[]) => void };

export default function GAD7({ onSubmit }: Props) {
  const [answers, setAnswers] = React.useState<number[]>(Array(7).fill(0));
  const total = answers.reduce((a,b)=>a+b,0);
  const severity = total >= 15 ? 'Severe' : total >= 10 ? 'Moderate' : total >= 5 ? 'Mild' : 'Minimal';

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">GAD‑7 (Anxiety)</h2>
      {GAD7_QUESTIONS.map((q, i) => (
        <div key={i} className="p-3 rounded-xl border">
          <div className="mb-2">{i+1}. {q}</div>
          <div className="flex gap-3">
            {[0,1,2,3].map(val => (
              <label key={val} className="flex items-center gap-1 cursor-pointer">
                <input type="radio" name={`gad-${i}`} checked={answers[i]===val} onChange={()=>{
                  const next=[...answers]; next[i]=val; setAnswers(next);
                }}/>
                <span>{['Not at all','Several days','More than half the days','Nearly every day'][val]}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="p-3 rounded-xl bg-gray-50 border">Score: <b>{total}</b> • Severity: <b>{severity}</b></div>
      <button className="px-4 py-2 rounded-xl bg-black text-white" onClick={()=>onSubmit(total, answers)}>Save GAD‑7</button>
    </div>
  );
}
