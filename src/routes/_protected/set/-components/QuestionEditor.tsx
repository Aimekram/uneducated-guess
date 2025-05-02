import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queries } from "@/lib/queries";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Trash, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

type QuestionEditorProps = {
  id: string;
  text: string;
};

const formSchema = z.object({
  text: z.string().min(1, "Question text is required"),
});

export const QuestionEditor = ({
  id: questionId,
  text,
}: QuestionEditorProps) => {
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);
  const [showDeletionConfirmation, setShowDeletionConfirmation] =
    useState(false);

  const updateQuestionRequest = useMutation({
    ...queries.questions.updateById(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries(queries.questionsWithAnswers);
    },
    onError: (err) => {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError(
          "An unexpected error occurred when updating. Please refresh and try again.",
        );
      }
    },
  });

  const deleteQuestionRequest = useMutation({
    ...queries.questions.deleteById,
    onSuccess: () => {
      queryClient.invalidateQueries(queries.questionsWithAnswers);
      queryClient.invalidateQueries({
        queryKey: queries.questionSets.queryKey,
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError(
          "An unexpected error occurred when deleting. Please refresh and try again.",
        );
      }
      setShowDeletionConfirmation(false);
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
    if (showDeletionConfirmation) {
      setShowDeletionConfirmation(false);
    }
  };

  const handleDelete = () => {
    if (showDeletionConfirmation) {
      deleteQuestionRequest.mutate({ questionId });
    } else {
      setShowDeletionConfirmation(true);
    }
  };

  const isAnyRequestPending =
    updateQuestionRequest.isPending || deleteQuestionRequest.isPending;

  return (
    <div className="relative">
      <div className="absolute -top-7 right-0 flex gap-2">
        {showDeletionConfirmation && (
          <Button
            type="button"
            aria-label="Cancel deletion"
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            disabled={isAnyRequestPending}
          >
            <X className="h-3.5 w-3.5 mr-1 text-destructive" />
            <span>Cancel</span>
          </Button>
        )}
        <Button
          type="button"
          aria-label={
            showDeletionConfirmation ? "Confirm deletion" : "Delete question"
          }
          size="sm"
          variant={showDeletionConfirmation ? "destructive" : "ghost"}
          onClick={handleDelete}
          disabled={isAnyRequestPending}
        >
          <Trash className="h-3.5 w-3.5 mr-1 text-inherit" />
          <span>
            {showDeletionConfirmation ? "Confirm deletion" : "Delete question"}
          </span>
        </Button>
      </div>

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
                  disabled={isAnyRequestPending}
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
                    disabled={isAnyRequestPending || !field.state.meta.isDirty}
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
                      isAnyRequestPending ||
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
    </div>
  );
};
