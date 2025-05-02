import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { queries } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { BackToDashboardButton } from "./-components/BackToDashboard";
import { QuestionsList } from "./-components/QuestionsList";
import { SetDeletionButtons } from "./-components/SetDeletionButtons";
import { SetNameEditor } from "./-components/SetNameEditor";

export const Route = createFileRoute("/_protected/set/$setId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { setId } = Route.useParams();

  const getQuestionSetRequest = useQuery(queries.questionSets.getById(setId));

  if (getQuestionSetRequest.isLoading) {
    return (
      <Layout>
        <Skeleton className="h-9 w-3/4 mb-8" />
        <Skeleton className="h-7 w-3/4 mb-2" />
        <Skeleton className="h-48 w-full mb-6" />
        <Skeleton className="h-48 w-full" />
      </Layout>
    );
  }

  if (getQuestionSetRequest.isError) {
    return (
      <Layout>
        <Alert variant="destructive">
          <AlertDescription>
            Error loading question set. Please try again.
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  if (!getQuestionSetRequest.data) {
    return (
      <Layout>
        <Alert>
          <AlertDescription>Question set not found.</AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8 flex justify-between gap-4">
        <SetNameEditor setId={setId} />
        <SetDeletionButtons setId={setId} />
      </div>
      <h2 className="text-lg font-semibold mb-2">Questions</h2>
      <QuestionsList setId={setId} />
    </Layout>
  );
}

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <BackToDashboardButton />
      </div>
      {children}
    </div>
  );
};
