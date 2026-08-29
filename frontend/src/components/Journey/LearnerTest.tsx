import { useState } from "react";

type Question = {
  question: string;
  options: string[];
  correctAnswer: number;
};

const QUESTIONS: Question[] = [
  {
    question: "What should you do when approaching a pedestrian crossing?",
    options: [
      "Speed up to cross quickly",
      "Stop and give pedestrians priority",
      "Sound the horn continuously",
      "Overtake vehicles near the crossing",
    ],
    correctAnswer: 1,
  },
  {
    question: "What does a red traffic light mean?",
    options: [
      "Proceed with caution",
      "Slow down",
      "Stop",
      "Give way only",
    ],
    correctAnswer: 2,
  },
  {
    question: "What should you do when an emergency vehicle approaches with its siren on?",
    options: [
      "Continue at the same speed",
      "Give way and allow it to pass",
      "Follow closely behind it",
      "Block the road to stop other vehicles",
    ],
    correctAnswer: 1,
  },
  {
    question: "Why should you wear a seat belt while driving?",
    options: [
      "Only to avoid a fine",
      "To reduce the risk of injury in a collision",
      "Only when driving on highways",
      "To improve fuel efficiency",
    ],
    correctAnswer: 1,
  },
  {
    question: "What should you do before changing lanes?",
    options: [
      "Accelerate immediately",
      "Check mirrors, signal and ensure the lane is clear",
      "Sound the horn and move across",
      "Only check the vehicle in front",
    ],
    correctAnswer: 1,
  },
];

type LearnerTestProps = {
  completing: boolean;
  onPass: () => void;
};

export function LearnerTest({
  completing,
  onPass,
}: LearnerTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[currentQuestion];
  const isLastQuestion = currentQuestion === QUESTIONS.length - 1;

  const handleNext = () => {
    if (selectedAnswer === null) {
      return;
    }

    const newScore =
      score + (selectedAnswer === question.correctAnswer ? 1 : 0);

    if (isLastQuestion) {
      setScore(newScore);
      setFinished(true);
      return;
    }

    setScore(newScore);
    setCurrentQuestion((previous) => previous + 1);
    setSelectedAnswer(null);
  };

  if (finished) {
    const passed = score >= 4;

    return (
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
        <div className="text-center">
          <div
            className={[
              "mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl font-bold",
              passed
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700",
            ].join(" ")}
          >
            {passed ? "✓" : "!"}
          </div>

          <p
            className={[
              "mt-4 text-xs font-semibold uppercase tracking-wide",
              passed ? "text-emerald-600" : "text-red-600",
            ].join(" ")}
          >
            {passed ? "Test passed" : "Test not passed"}
          </p>

          <h3 className="mt-1 text-xl font-bold text-slate-900">
            {score} / {QUESTIONS.length}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {passed
              ? "You have successfully completed the Learner's Licence test."
              : "You need a score of at least 4 out of 5 to pass this test."}
          </p>

          {passed ? (
            <button
              type="button"
              disabled={completing}
              onClick={onPass}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {completing ? "Completing..." : "Continue"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswer(null);
                setScore(0);
                setFinished(false);
              }}
              className="mt-5 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Retake Test
            </button>
          )}
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Learner's Licence Test
          </p>

          <p className="mt-1 text-sm font-medium text-slate-900">
            Question {currentQuestion + 1} of {QUESTIONS.length}
          </p>
        </div>

        <span className="text-xs font-semibold text-slate-400">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h3 className="mt-6 text-base font-semibold leading-6 text-slate-900">
        {question.question}
      </h3>

      <div className="mt-4 space-y-2">
        {question.options.map((option, index) => {
          const selected = selectedAnswer === index;

          return (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedAnswer(index)}
              className={[
                "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition",
                selected
                  ? "border-blue-500 bg-blue-50 text-blue-900"
                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-slate-50",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  selected
                    ? "border-blue-500 bg-blue-600 text-white"
                    : "border-slate-300 text-slate-400",
                ].join(" ")}
              >
                {String.fromCharCode(65 + index)}
              </span>

              <span>{option}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="button"
          disabled={selectedAnswer === null}
          onClick={handleNext}
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLastQuestion ? "Finish Test" : "Next Question"}
        </button>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-400">
        Practice assessment for the Saarathi 2.0 prototype.
      </p>
    </div>
  );
}