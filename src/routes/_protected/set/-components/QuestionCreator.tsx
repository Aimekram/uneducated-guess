import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queries } from "@/lib/queries";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

type AddQuestionProps = {
  setId: string;
};

const formSchema = z.object({
  text: z.string().min(1, "Question text is required"),
});

export const QuestionCreator = ({ setId }: AddQuestionProps) => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const createQuestionRequest = useMutation({
    ...queries.questions.create,
    onSuccess: () => {
      queryClient.invalidateQueries(queries.questionsWithAnswers);
      queryClient.invalidateQueries(queries.questionSets);
      form.reset();
      setIsFormOpen(false);
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
      text: "",
    },
    onSubmit: ({ value }) => {
      setFormError(null);
      createQuestionRequest.mutate({ text: value.text, setId });
    },
  });

  const handleCancel = () => {
    form.reset();
    setIsFormOpen(false);
    setFormError(null);
  };

  if (!isFormOpen) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center py-8">
          <Button
            variant="outline"
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add question</span>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 pt-4 px-4">
        {formError && (
          <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-3 text-sm">
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
                    onBlur={field.handleBlur}
                    placeholder="Enter question text..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        form.handleSubmit();
                      } else if (e.key === "Escape") {
                        handleCancel();
                      }
                    }}
                    disabled={createQuestionRequest.isPending}
                    autoComplete="off"
                    autoCorrect="off"
                    className="flex-1"
                  />
                </div>
                {field.state.meta.errors?.[0] && (
                  <p className="text-sm text-destructive mt-1">
                    {field.state.meta.errors[0].message}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex items-center gap-2 mt-2 justify-end">
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={handleCancel}
              disabled={createQuestionRequest.isPending}
            >
              <X className="h-4 w-4 mr-1 text-destructive" />
              <span>Cancel</span>
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  size="sm"
                  variant="outline"
                  disabled={
                    !canSubmit ||
                    createQuestionRequest.isPending ||
                    isSubmitting
                  }
                >
                  <Check className="h-4 w-4 mr-1 text-green-600" />{" "}
                  <span>Add question</span>
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardHeader>
    </Card>
  );
};
