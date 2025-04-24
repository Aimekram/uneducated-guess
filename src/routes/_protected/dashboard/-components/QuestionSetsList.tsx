import { Card } from "@/components/ui";
import { queries } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

export const QuestionSetsList = () => {
  const getQuestsionSetsRequest = useQuery(queries.questsionSets.getAll);

  if (getQuestsionSetsRequest.isError) {
    return (
      <Layout>
        <h3 className="mb-4 text-red-500">
          Couldn't get your data, please refresh and try again
        </h3>
      </Layout>
    );
  }

  if (getQuestsionSetsRequest.isLoading) {
    return (
      <Layout>
        <h3 className="mb-4 text-gray-500">Loading...</h3>
      </Layout>
    );
  }

  if (
    !getQuestsionSetsRequest.data ||
    getQuestsionSetsRequest.data.length === 0
  ) {
    return (
      <Layout>
        <h3 className="mb-4 text-gray-500">No question sets found</h3>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {getQuestsionSetsRequest.data.map((set) => (
          <Card key={set.id} className="p-4 hover:shadow-md transition-shadow">
            <h3 className="font-semibold">{set.title}</h3>
            <p className="text-sm text-gray-500">{set.description}</p>
            <p className="text-xs text-gray-400 mt-2">
              {set.questions?.length || 0} questions
            </p>
          </Card>
        ))}
      </div>
    </Layout>
  );
};

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Your question sets</h2>
      {children}
    </div>
  );
};
