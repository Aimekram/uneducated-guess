import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { queries } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { QuestionsList } from "./-components/QuestionsList";
import { SetNameEditor } from "./-components/SetNameEditor";

export const Route = createFileRoute("/_protected/set/$setId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setId } = Route.useParams();

  const getQuestionSetRequest = useQuery(queries.questionSets.getById(setId));

  if (getQuestionSetRequest.isLoading) {
    return (
      <div className="container mx-auto py-4">
        <Skeleton className="h-9 w-3/4 mb-8" />
        <Skeleton className="h-7 w-3/4 mb-2" />
        <Skeleton className="h-48 w-full mb-6" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (getQuestionSetRequest.isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading question set. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!getQuestionSetRequest.data) {
    return (
      <Alert>
        <AlertDescription>Question set not found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <SetNameEditor setId={setId} />
      <h2 className="text-lg font-semibold mb-2">Questions</h2>
      <QuestionsList setId={setId} />
    </div>
  );
}
