import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { queries } from "@/lib/queries";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Trash, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

type AnswerEditorProps = {
  questionId: string;
  existingAnswer?: { id: string; text: string; points: number };
  onCancel?: () => void;
};

const formSchema = z.object({
  text: z.string().min(1, "Answer text is required"),
  points: z.number().int().min(0, "Points must be a positive number"),
});

export const AnswerEditor = ({
  questionId,
  existingAnswer,
  onCancel,
}: AnswerEditorProps) => {
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const createAnswerRequest = useMutation({
    ...queries.answers.create(questionId),
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries(queries.questionsWithAnswers);
    },
    onError: (err) => {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    },
  });

  const updateAnswerRequest = useMutation({
    ...queries.answers.updateById(existingAnswer?.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries(queries.questionsWithAnswers);
      form.reset();
    },
    onError: (err) => {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    },
  });

  const deleteAnswerRequest = useMutation({
    ...queries.answers.deleteById,
    onSuccess: () => {
      queryClient.invalidateQueries(queries.questionsWithAnswers);
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
    defaultValues: {
      text: existingAnswer?.text || "",
      points: existingAnswer?.points || 0,
    },
    onSubmit: ({ value: { text, points } }) => {
      setFormError(null);
      if (existingAnswer?.id !== undefined) {
        updateAnswerRequest.mutate({ text, points });
      } else {
        createAnswerRequest.mutate({ text, points });
      }
    },
  });

  const handleCancel = () => {
    form.reset();
    setFormError(null);
    onCancel?.();
  };

  const isAnyAnswerRequestPending =
    createAnswerRequest.isPending ||
    updateAnswerRequest.isPending ||
    deleteAnswerRequest.isPending;

  return (
    <>
      {formError && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-3">
          {formError}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex gap-2">
          <Button
            type="button"
            aria-label="Delete answer"
            size="icon"
            variant="ghost"
            disabled={existingAnswer === undefined || isAnyAnswerRequestPending}
            onClick={() => {
              if (existingAnswer?.id) {
                deleteAnswerRequest.mutate({
                  answerId: existingAnswer.id,
                });
              }
            }}
            className="h-9"
          >
            <Trash className="h-3 w-3 text-destructive" />
          </Button>
          <div className="flex-1 flex gap-1">
            <form.Field name="text">
              {(field) => (
                <div className="flex-1">
                  <Input
                    id={field.name}
                    name={field.name}
                    aria-label="Answer text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
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
                    disabled={isAnyAnswerRequestPending}
                    className={
                      field.state.meta.isDirty
                        ? "border-amber-400 bg-amber-100 border-2"
                        : ""
                    }
                    autoComplete="off"
                    autoFocus={existingAnswer === undefined}
                  />
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-destructive mt-1">
                      {field.state.meta.errors[0].message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
            <form.Field name="points">
              {(field) => (
                <div>
                  <Input
                    id={field.name}
                    name={field.name}
                    aria-label="Points"
                    type="number"
                    value={field.state.value?.toString() || "0"}
                    onChange={(e) =>
                      field.handleChange(
                        Number.parseInt(e.target.value, 10) || 0,
                      )
                    }
                    onBlur={field.handleBlur}
                    disabled={isAnyAnswerRequestPending}
                    className={
                      field.state.meta.isDirty
                        ? "border-amber-400 bg-amber-100 border-2"
                        : ""
                    }
                    style={{ width: "100px" }}
                  />
                  {field.state.meta.errors?.[0] && (
                    <p className="text-sm text-destructive mt-1">
                      {field.state.meta.errors[0].message}
                    </p>
                  )}
                </div>
              )}
            </form.Field>
          </div>
          <div className="flex gap-1">
            <form.Subscribe
              selector={(state) => ({
                isDirty: state.isDirty,
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {(state) => (
                <>
                  <Button
                    type="button"
                    aria-label="Cancel answer edit"
                    size="icon"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={
                      isAnyAnswerRequestPending ||
                      (existingAnswer !== undefined && !state.isDirty) ||
                      state.isSubmitting
                    }
                    className="h-9"
                  >
                    <X className="h-3 w-3 text-destructive" />
                  </Button>
                  <Button
                    type="submit"
                    aria-label={
                      existingAnswer === undefined
                        ? "Save answer"
                        : "Add answer"
                    }
                    size="icon"
                    variant="outline"
                    disabled={
                      isAnyAnswerRequestPending ||
                      (existingAnswer !== undefined && !state.isDirty) ||
                      !state.canSubmit ||
                      state.isSubmitting
                    }
                    className="h-9"
                  >
                    <Check className="h-3 w-3 text-green-600" />
                  </Button>
                </>
              )}
            </form.Subscribe>
          </div>
        </div>
      </form>
    </>
  );
};
