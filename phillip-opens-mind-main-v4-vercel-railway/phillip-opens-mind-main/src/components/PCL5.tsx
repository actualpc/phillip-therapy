import React from 'react';

const QUESTIONS = [
  'Repeated, disturbing memories, thoughts, or images of a stressful experience from the past?',
  'Repeated, disturbing dreams of a stressful experience from the past?',
  'Suddenly feeling or acting as if a stressful experience were happening again (as if you were reliving it)?',
  'Feeling very upset when something reminded you of a stressful experience from the past?',
  'Having strong physical reactions when something reminded you of a stressful experience (e.g., heart pounding, sweating)?',
  'Avoiding memories, thoughts, or feelings related to the stressful experience?',
  'Avoiding external reminders (people, places, conversations) that arouse distressing memories?',
  'Trouble remembering important parts of the stressful experience?',
  'Having strong negative beliefs about yourself, other people, or the world?',
  'Blaming yourself or someone else for the stressful experience or what happened after it?',
  'Having strong negative feelings such as fear, horror, anger, guilt, or shame?',
  'Loss of interest in activities?',
  'Feeling distant or cut off from other people?',
  'Trouble experiencing positive feelings (e.g., inability to feel happiness or love)?',
  'Irritable behavior, angry outbursts, or acting aggressively?',
  'Taking too many risks or doing things that could cause you harm?',
  'Being “superalert” or watchful on guard?',
  'Feeling jumpy or easily startled?',
  'Having difficulty concentrating?',
  'Trouble falling or staying asleep?'
];

// Scoring: 0=Not at all, 1=A little bit, 2=Moderately, 3=Quite a bit, 4=Extremely
// Range: 0–80. A score >= 33 is commonly used as a cutoff for probable PTSD (screen, not diagnosis).

type Props = { onSubmit: (score: number, answers: number[]) => void };

export default function PCL5({ onSubmit }: Props) {
  const [answers, setAnswers] = React.useState<number[]>(Array(20).fill(0));
  const total = answers.reduce((a,b)=>a+b,0);
  const screen = total>=33 ? 'Positive (≥33, probable PTSD — clinical follow‑up recommended)' : 'Negative';

  return (
    <div className="space-y-4 p-4 rounded-xl border">
      <h2 className="text-xl font-semibold">PCL‑5 (PTSD Checklist)</h2>
      {QUESTIONS.map((q, i)=>(
        <div key={i} className="space-y-2">
          <div className="font-medium">{i+1}. {q}</div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {['Not at all','A little bit','Moderately','Quite a bit','Extremely'].map((label, val)=>(
              <label key={val} className="flex items-center gap-2 p-2 rounded-lg border">
                <input type="radio" name={`pcl-${i}`} checked={answers[i]===val} onChange={()=>{
                  const next=[...answers]; next[i]=val; setAnswers(next);
                }}/>
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="p-3 rounded-xl bg-gray-50 border">Score: <b>{total}</b> • Screen: <b>{screen}</b></div>
      <button className="px-4 py-2 rounded-xl bg-black text-white" onClick={()=>onSubmit(total, answers)}>Save PCL‑5</button>
    </div>
  );
}
