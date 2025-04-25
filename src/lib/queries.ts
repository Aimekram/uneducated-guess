import { supabase } from "./supabase";

export const queries = {
  questionSets: {
    getAll: {
      queryKey: ["questionSets", "getAll"],
      queryFn: async () => {
        const { data, error } = await supabase.from("question_sets").select(`
            id,
            name,
            questions_count: questions(count)
          `);
        if (error) throw new Error(error.message);
        return data.map((set) => ({
          ...set,
          questions_count: set.questions_count?.[0]?.count ?? 0,
        }));
      },
    },
  },
};
