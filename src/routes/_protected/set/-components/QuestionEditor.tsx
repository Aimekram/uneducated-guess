import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queries } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
// import { AnswersList } from "./AnswersList";

type QuestionEditorProps = {
  id: string;
  setId: string;
  text: string;
  answers: {
    id: string;
    text: string;
    points: number;
  }[];
};

const formSchema = z.object({
  text: z.string().min(1, "Question text is required"),
});

export const QuestionEditor = ({
  id: questionId,
  setId,
  text,
  //   answers,
}: QuestionEditorProps) => {
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const updateQuestionRequest = useMutation({
    ...queries.questions.updateById(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.questionsWithAnswers.getBySetId(setId).queryKey,
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    },
  });

  const form = useForm({
    validators: { onSubmit: formSchema },
    defaultValues: { text },
    onSubmit: ({ value }) => {
      setFormError(null);
      updateQuestionRequest.mutate({ text: value.text });
    },
  });

  const handleCancel = () => {
    form.reset();
    setFormError(null);
  };

  return (
    <Card className={cn(form.state.isDirty && "bg-amber-50")}>
      <CardHeader className="pb-3 pt-4 px-4">
        {formError && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-3">
            {formError}
          </div>
        )}

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="text">
            {(field) => (
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor={field.name} className="mb-2">
                    Question text
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    autoFocus
                    onBlur={field.handleBlur}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        e.preventDefault();
                        form.handleSubmit();
                      }
                      if (e.key === "Escape") {
                        e.preventDefault();
                        handleCancel();
                      }
                    }}
                    disabled={updateQuestionRequest.isPending}
                    className={
                      field.state.meta.isDirty
                        ? "border-amber-400 bg-amber-100 border-2"
                        : ""
                    }
                  />
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      aria-label="Cancel question text edit"
                      size="icon"
                      variant="ghost"
                      onClick={handleCancel}
                      disabled={
                        updateQuestionRequest.isPending ||
                        !field.state.meta.isDirty
                      }
                      className="h-9"
                    >
                      <X className="h-3 w-3 text-destructive" />
                    </Button>
                    <Button
                      type="submit"
                      aria-label="Save question text"
                      size="icon"
                      variant="outline"
                      disabled={
                        !form.state.canSubmit ||
                        updateQuestionRequest.isPending ||
                        form.state.isSubmitting ||
                        !field.state.meta.isDirty
                      }
                      className="h-9"
                    >
                      <Check className="h-3 w-3 text-green-600" />
                    </Button>
                  </div>
                </div>
                {field.state.meta.errors?.[0] && (
                  <p className="text-sm text-destructive mt-1">
                    {field.state.meta.errors[0].message}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </form>
      </CardHeader>
      <CardContent className="space-y-4 pb-4 px-4">
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Answers</h4>
          {/* <AnswersList answers={answers} questionId={questionId} editable /> */}
        </div>
      </CardContent>
    </Card>
  );
};
