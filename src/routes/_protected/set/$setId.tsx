// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Skeleton } from "@/components/ui/skeleton";
import { queries } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { SetNameEditor } from "./-components/SetNameEditor";

export const Route = createFileRoute("/_protected/set/$setId")({
  component: RouteComponent,
});

function RouteComponent() {
  // Access the id parameter from the route
  const { setId } = Route.useParams();

  const getQuestionsWithAnswersRequest = useQuery(
    queries.questionsWithAnswers.getBySetId(setId),
  );

  // Handle loading state
  if (getQuestionsWithAnswersRequest.isLoading) {
    return (
      <div className="space-y-4">
        {/* <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" /> */}
      </div>
    );
  }

  // Handle error state
  if (getQuestionsWithAnswersRequest.isError) {
    return (
      //   <Alert variant="destructive">
      //     <AlertDescription>
      <p>Error loading question set. Please try again.</p>
      //     </AlertDescription>
      //   </Alert>
    );
  }

  // Handle not found
  //   if (!questionSetQuery.data) {
  //     return (
  //       <Alert>
  //         <AlertDescription>Question set not found.</AlertDescription>
  //       </Alert>
  //     );
  //   }

  return (
    <div className="container mx-auto p-4">
      <SetNameEditor setId={setId} />
    </div>
  );
}
