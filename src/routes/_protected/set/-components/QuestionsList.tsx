import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { queries } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { AnswersList } from "./AnswersList";
import { QuestionCreator } from "./QuestionCreator";
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
      <div className="container space-y-6">
        <QuestionCreator setId={setId} />
        <Alert variant="default">
          <AlertDescription>
            No questions found for this set. Add a question above to get
            started!
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container space-y-6">
      <QuestionCreator setId={setId} />
      {getQuestionsWithAnswersRequest.data.map((question) => (
        <Card key={question.id} className="gap-0">
          <CardHeader className="pb-3 pt-4 px-4">
            <QuestionEditor id={question.id} text={question.text} />
          </CardHeader>
          <CardContent className="space-y-4 pb-4 px-4">
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Answers</h4>
              <AnswersList
                answers={question.answers}
                questionId={question.id}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
