import React from 'react';

const QUESTIONS = [
  'Have you used drugs other than those required for medical reasons?',
  'Do you abuse more than one drug at a time?',
  'Are you always able to stop using drugs when you want to? (No = 1)',
  'Have you had “blackouts” or “flashbacks” as a result of drug use?',
  'Do you ever feel bad or guilty about your drug use?',
  'Does your spouse (or parents) ever complain about your involvement with drugs?',
  'Have you neglected your family because of your use of drugs?',
  'Have you engaged in illegal activities in order to obtain drugs?',
  'Have you experienced withdrawal symptoms when you stopped taking drugs?',
  'Have you had medical problems as a result of your drug use (e.g., memory loss, hepatitis, convulsions, bleeding)?'
];

type Props = { onSubmit: (score: number, answers: number[]) => void };

export default function DAST10({ onSubmit }: Props) {
  // Default all to 0 (No)
  const [answers, setAnswers] = React.useState<number[]>(Array(10).fill(0));
  // Scoring: Yes=1, No=0, EXCEPTION: Q3 (reverse) where Yes=0, No=1
  const score = answers.reduce((sum, val, idx)=>{
    if (idx===2) { // Q3 reverse
      return sum + (val===1 ? 0 : 1);
    }
    return sum + (val===1 ? 1 : 0);
  }, 0);

  let severity = 'Low';
  if (score>=9) severity='Severe';
  else if (score>=6) severity='Substantial';
  else if (score>=3) severity='Moderate';

  return (
    <div className="space-y-4 p-4 rounded-xl border">
      <h2 className="text-xl font-semibold">DAST‑10 (Drug Use)</h2>
      {QUESTIONS.map((q, i)=>(
        <div key={i} className="space-y-2">
          <div className="font-medium">{i+1}. {q}</div>
          <div className="grid grid-cols-2 gap-2">
            {['No','Yes'].map((label, val)=>(
              <label key={val} className="flex items-center gap-2 p-2 rounded-lg border">
                <input type="radio" name={`dast-${i}`} checked={answers[i]===val} onChange={()=>{
                  const next=[...answers]; next[i]=val; setAnswers(next);
                }}/>
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="p-3 rounded-xl bg-gray-50 border">Score: <b>{score}</b> • Severity: <b>{severity}</b></div>
      <button className="px-4 py-2 rounded-xl bg-black text-white" onClick={()=>onSubmit(score, answers)}>Save DAST‑10</button>
    </div>
  );
}
