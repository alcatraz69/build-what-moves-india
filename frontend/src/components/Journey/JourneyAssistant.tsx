import { useState } from "react";
import { askJourneyAssistant } from "../../services/journeyService";

type JourneyAssistantProps = {
  applicantId: string;
};

const suggestedQuestions = [
  "What do I need to do next?",
  "Why am I waiting?",
  "What requirements are still incomplete?",
];

export function JourneyAssistant({ applicantId }: JourneyAssistantProps) {
  const [question, setQuestion] = useState(suggestedQuestions[0]);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (submittedQuestion = question) => {
    const trimmedQuestion = submittedQuestion.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await askJourneyAssistant(applicantId, {
        question: trimmedQuestion,
      });

      setQuestion(trimmedQuestion);
      setAnswer(response.answer);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get an assistant response.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold text-slate-900">
          AI Journey Assistant
        </h2>

        <p className="text-xs text-slate-500">
          Ask about your current step, blockers, requirements, or what comes
          next.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestedQuestions.map((suggestedQuestion) => (
          <button
            key={suggestedQuestion}
            type="button"
            disabled={loading}
            onClick={() => handleAsk(suggestedQuestion)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {suggestedQuestion}
          </button>
        ))}
      </div>

      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          handleAsk();
        }}
      >
        <input
          type="text"
          value={question}
          disabled={loading}
          onChange={(event) => setQuestion(event.target.value)}
          className="min-h-11 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
          placeholder="Ask about your licence journey"
        />

        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="min-h-11 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Asking..." : "Ask"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {answer && !error && (
        <div className="mt-4 rounded-lg border border-blue-100 bg-white p-4">
          <p className="whitespace-pre-line text-sm leading-6 text-slate-700">
            {answer}
          </p>
        </div>
      )}
    </section>
  );
}
