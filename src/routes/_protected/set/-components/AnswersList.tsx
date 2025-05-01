import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { AnswerEditor } from "./AnswerEditor";

type AnswersListProps = {
  answers: {
    id: string;
    text: string;
    points: number;
  }[];
  questionId: string;
};

export const AnswersList = ({ answers, questionId }: AnswersListProps) => {
  const [isAddingAnswer, setIsAddingAnswer] = useState(false);

  if (answers.length === 0 && !isAddingAnswer) {
    return (
      <div className="py-3">
        <p className="text-sm text-muted-foreground mb-3">No answers yet</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingAnswer(true)}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          <span>Add first answer</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {answers.map((answer) => (
        <AnswerEditor
          key={answer.id}
          existingAnswer={answer}
          questionId={questionId}
        />
      ))}

      {isAddingAnswer ? (
        <AnswerEditor
          questionId={questionId}
          onCancel={() => setIsAddingAnswer(false)}
        />
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingAnswer(true)}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          <span>Add answer</span>
        </Button>
      )}
    </div>
  );
};
