import { queries } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";

type QandAListProps = {
  setId: string;
};

export const QandAList = ({ setId }: QandAListProps) => {
  console.log("serid", setId);

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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Questions & Answers</h2>

      {getQuestionsWithAnswersRequest.data.map((question, qIndex) => (
        <div
          key={question.id}
          className="bg-white rounded-lg shadow p-5 border border-gray-100"
        >
          <h3 className="text-xl font-semibold mb-3">
            {qIndex + 1}. {question.text}
          </h3>

          <div className="pl-5 space-y-2">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Answers:</h4>

            {question.answers.length > 0 ? (
              <ul className="space-y-3">
                {question.answers.map((answer) => (
                  <li
                    key={answer.id}
                    className="flex justify-between items-center p-2.5 rounded-md bg-gray-50 hover:bg-gray-100"
                  >
                    <span>{answer.text}</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
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
        </div>
      ))}
    </div>
  );
};
