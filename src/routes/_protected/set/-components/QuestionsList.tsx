import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { queries } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { QuestionEditor } from "./QuestionEditor";

type QuestionsListProps = {
  setId: string;
};

export const QuestionsList = ({ setId }: QuestionsListProps) => {
  const getQuestionsWithAnswersRequest = useQuery(
    queries.questionsWithAnswers.getBySetId(setId),
  );

  if (getQuestionsWithAnswersRequest.isLoading) {
    return (
      <div className="container space-y-6 mt-8">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (
    getQuestionsWithAnswersRequest.isError ||
    !getQuestionsWithAnswersRequest.data
  ) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading questions. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (getQuestionsWithAnswersRequest.data.length === 0) {
    return (
      <Alert variant="default">
        <AlertDescription>
          No questions found for this set. Add some questions to get started!
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container space-y-6">
      {getQuestionsWithAnswersRequest.data.map((question) => (
        <QuestionEditor
          key={question.id}
          id={question.id}
          text={question.text}
          answers={question.answers}
          setId={setId}
        />
      ))}
    </div>
  );
};
