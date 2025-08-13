import React from 'react';

const PHQ9_QUESTIONS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead, or thoughts of hurting yourself in some way'
];

type Props = { onSubmit: (score: number, answers: number[]) => void };

export default function PHQ9({ onSubmit }: Props) {
  const [answers, setAnswers] = React.useState<number[]>(Array(9).fill(0));
  const total = answers.reduce((a,b)=>a+b,0);
  const severity = total >= 20 ? 'Severe' : total >= 15 ? 'Moderately Severe' : total >= 10 ? 'Moderate' : total >= 5 ? 'Mild' : 'Minimal';

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">PHQ‑9 (Depression)</h2>
      {PHQ9_QUESTIONS.map((q, i) => (
        <div key={i} className="p-3 rounded-xl border">
          <div className="mb-2">{i+1}. {q}</div>
          <div className="flex gap-3">
            {[0,1,2,3].map(val => (
              <label key={val} className="flex items-center gap-1 cursor-pointer">
                <input type="radio" name={`phq-${i}`} checked={answers[i]===val} onChange={()=>{
                  const next=[...answers]; next[i]=val; setAnswers(next);
                }}/>
                <span>{['Not at all','Several days','More than half the days','Nearly every day'][val]}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="p-3 rounded-xl bg-gray-50 border">Score: <b>{total}</b> • Severity: <b>{severity}</b></div>
      <button className="px-4 py-2 rounded-xl bg-black text-white" onClick={()=>onSubmit(total, answers)}>Save PHQ‑9</button>
    </div>
  );
}
