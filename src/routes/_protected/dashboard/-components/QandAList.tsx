import { queries } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

type QandAListProps = {
  setId: string;
};

export const QandAList = ({ setId }: QandAListProps) => {
  const getQuestionsWithAnswersRequest = useQuery(
    queries.questionsWithAnswers.getBySetId(setId),
  );

  if (getQuestionsWithAnswersRequest.isLoading) {
    return <p className="mb-4 text-gray-500">Loading...</p>;
  }

  if (getQuestionsWithAnswersRequest.isError) {
    return (
      <div className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-200">
        Error loading questions, please refresh to try again.
      </div>
    );
  }

  if (
    !getQuestionsWithAnswersRequest.data ||
    getQuestionsWithAnswersRequest.data.length === 0
  ) {
    return (
      <div className="text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
        No questions found for this set. Add some questions to get started!
      </div>
    );
  }

  return (
    <ol className="space-y-8">
      {getQuestionsWithAnswersRequest.data.map((question, qIndex) => (
        <li key={question.id} className="border-b border-gray-100 pb-6">
          <h3 className="text-md font-medium mb-2">
            {qIndex + 1}. {question.text}
          </h3>
          <div className="px-4 mt-3">
            {question.answers.length > 0 ? (
              <ul className="space-y-1.5">
                {question.answers.map((answer) => (
                  <li
                    key={answer.id}
                    className="flex justify-between items-center p-1.5 rounded bg-gray-50"
                  >
                    <span>{answer.text}</span>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium ml-2">
                      {answer.points} points
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No answers added yet
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
};
