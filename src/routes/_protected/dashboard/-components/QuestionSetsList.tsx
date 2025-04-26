import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { queries } from "@/lib/queries";
import { useQuery } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";
import { QandAList } from "./QandAList";

export const QuestionSetsList = () => {
  const getQuestsionSetsRequest = useQuery(queries.questionSets.getAll);

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
      <Accordion type="single" collapsible className="grid gap-4 grid-cols-1">
        {getQuestsionSetsRequest.data.map((set) => (
          <AccordionItem
            key={set.id}
            value={set.id}
            className="bg-card rounded-lg shadow-sm hover:shadow-md transition-all"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline cursor-pointer">
              <div className="flex justify-between items-center w-full pr-4">
                <div className="text-left">
                  <h3 className="font-semibold text-lg">{set.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {`${set.questions_count} questions`}
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-2 pb-4 px-4">
                <QandAList setId={set.id} />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
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
