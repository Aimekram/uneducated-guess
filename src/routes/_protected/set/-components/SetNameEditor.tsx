import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { queries } from "@/lib/queries";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { SetNameEditable } from "./SetNameEditable";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type SetNameEditorProps = {
  setId: string;
};

export const SetNameEditor = ({ setId }: SetNameEditorProps) => {
  const queryClient = useQueryClient();
  const [isEditingName, setIsEditingName] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const getQuestionSetRequest = useQuery(queries.questionSets.getById(setId));

  const updateSetRequest = useMutation({
    ...queries.questionSets.updateById(setId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queries.questionSets.queryKey,
      });

      setIsEditingName(false);
    },
    onError: (err) => {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("An unexpected error occurred, please try again");
      }
    },
  });

  const form = useForm({
    validators: { onSubmit: formSchema },
    defaultValues: {
      name: getQuestionSetRequest.data?.name || "",
    },
    onSubmit: ({ value }) => {
      setFormError(null);
      updateSetRequest.mutate({ name: value.name });
    },
  });

  if (!isEditingName) {
    return (
      <SetNameEditable
        name={getQuestionSetRequest.data?.name || ""}
        isLoading={getQuestionSetRequest.isLoading}
        isError={getQuestionSetRequest.isError}
        onEditBtnClick={() => setIsEditingName(true)}
      />
    );
  }

  return (
    <div className="max-w-xl">
      {formError && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-3 text-sm">
          {formError}
        </div>
      )}

      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field name="name">
          {(field) => (
            <div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor={field.name}
                  className="text-xl font-semibold shrink-0"
                >
                  Set name:
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  autoFocus
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      form.handleSubmit();
                    } else if (e.key === "Escape") {
                      setIsEditingName(false);
                    }
                  }}
                  disabled={updateSetRequest.isPending}
                  autoComplete="off"
                  autoCorrect="off"
                />
              </div>
              {field.state.meta.errors?.[0] && (
                <p className="text-sm text-destructive mt-1 ml-26">
                  {field.state.meta.errors[0].message}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <div className="self-end flex items-center gap-2 mt-2">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                size="sm"
                variant="outline"
                disabled={
                  !canSubmit || updateSetRequest.isPending || isSubmitting
                }
              >
                <Check className="h-4 w-4 mr-1 text-green-600" />{" "}
                <span>Save</span>
              </Button>
            )}
          </form.Subscribe>

          <Button
            size="sm"
            variant="default"
            type="button"
            onClick={() => setIsEditingName(false)}
            disabled={updateSetRequest.isPending}
          >
            <X className="h-4 w-4 mr-1 text-destructive" />
            <span>Cancel</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
