import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit } from "lucide-react";

type SetNameEditableProps = {
  name: string;
  isLoading: boolean;
  isError: boolean;
  onEditBtnClick: () => void;
};

export const SetNameEditable = ({
  name,
  isLoading,
  isError,
  onEditBtnClick,
}: SetNameEditableProps) => {
  if (isLoading) {
    return (
      <div className="mb-8">
        <h1 className="text-xl font-semibold flex items-center gap-4">
          <span>Set name:</span>
          <Skeleton className="h-9 w-sm inline-block align-middle" />
        </h1>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mb-8 flex items-center min-h-9">
        <h1 className="text-xl font-semibold">
          <span className="mr-2">Set name:</span>
          <span className="text-sm text-red-500 font-normal">
            Error, please refresh
          </span>
        </h1>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 min-h-9">
      <h1 className="text-xl font-semibold">
        <span className="mr-2">Set name:</span>
        <span>{name}</span>
      </h1>

      <Button
        variant="default"
        size="sm"
        onClick={onEditBtnClick}
        className="opacity-70 hover:opacity-100"
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );
};
