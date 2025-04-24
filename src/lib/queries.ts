import { supabase } from "./supabase";

export const queries = {
  questsionSets: {
    getAll: {
      queryKey: ["questionSets", "getAll"],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("question_sets")
          .select("*");
        if (error) throw new Error(error.message);
        return data;
      },
    },
  },
};
