import { Button } from "@/components/ui/button";
import { queries } from "@/lib/queries";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Trash, X } from "lucide-react";
import { useState } from "react";

type SetDeletionButtonsProps = {
  setId: string;
};

export const SetDeletionButtons = ({ setId }: SetDeletionButtonsProps) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteSetMutation = useMutation({
    ...queries.questionSets.deleteById,
    onSuccess: () => {
      navigate({ to: "/dashboard" });
    },
    onError: (err) => {
      if (err instanceof Error) {
        setDeleteError(err.message);
      } else {
        setDeleteError("An unexpected error occurred while deleting the set");
      }
      setShowConfirmation(false);
    },
  });

  const handleDelete = () => {
    if (showConfirmation) {
      deleteSetMutation.mutate({ setId });
    } else {
      setShowConfirmation(true);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      {deleteError && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-3">
          {deleteError}
        </div>
      )}

      {showConfirmation && (
        <Button
          type="button"
          aria-label="Cancel deletion"
          size="sm"
          variant="ghost"
          onClick={handleCancel}
          disabled={deleteSetMutation.isPending}
          className="mr-2"
        >
          <X className="h-3.5 w-3.5 mr-1 text-destructive" />
          <span>Cancel</span>
        </Button>
      )}
      <Button
        type="button"
        aria-label={showConfirmation ? "Confirm deletion" : "Delete set"}
        size="sm"
        variant={showConfirmation ? "destructive" : "ghost"}
        onClick={handleDelete}
        disabled={deleteSetMutation.isPending}
      >
        <Trash className="h-3.5 w-3.5 mr-1 text-inherit" />
        <span>{showConfirmation ? "Confirm deletion" : "Delete set"}</span>
      </Button>
    </div>
  );
};
