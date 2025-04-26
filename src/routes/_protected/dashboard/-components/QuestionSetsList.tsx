import { Card } from "@/components/ui";
import { queries } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import { type PropsWithChildren, useState } from "react";
import { QandAList } from "./QandAList";

export const QuestionSetsList = () => {
  const [expandedSetId, setExpandedSetId] = useState<string | null>(null);

  const getQuestsionSetsRequest = useQuery(queries.questionSets.getAll);

  const toggleAccordion = (setId: string) => {
    setExpandedSetId(expandedSetId === setId ? null : setId);
  };

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
      <div className="grid gap-6 grid-cols-1">
        {getQuestsionSetsRequest.data.map((set) => (
          <div key={set.id} className="flex flex-col">
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{set.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {`${set.questions_count} questions`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleAccordion(set.id)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  {expandedSetId === set.id
                    ? "Hide Questions"
                    : "Show Questions"}
                </button>
              </div>
            </Card>

            {expandedSetId === set.id && (
              <div className="mt-2 pl-4 pt-2 pb-6 border-l-2 border-blue-200">
                <QandAList setId={set.id} />
              </div>
            )}
          </div>
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
