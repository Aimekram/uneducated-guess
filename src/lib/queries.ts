import { supabase } from "./supabase";

export const queries = {
  questionSets: {
    queryKey: ["questionSets"],
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
    getById: (setId: string) => ({
      queryKey: ["questionSets", "getById", setId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("question_sets")
          .select(`
              id,
              name,
              questions_count: questions(count)
            `)
          .eq("id", setId)
          .single();
        if (error) throw new Error(error.message);
        return {
          ...data,
          questions_count: data.questions_count?.[0]?.count ?? 0,
        };
      },
    }),
    updateById: (setId: string) => ({
      mutationFn: async (data: { name: string }) => {
        const { error } = await supabase
          .from("question_sets")
          .update({ name: data.name })
          .eq("id", setId);
        if (error) throw new Error(error.message);
        return data;
      },
    }),
  },
  questionsWithAnswers: {
    getBySetId: (setId: string) => ({
      queryKey: ["questionsWithAnswers", "getBySetId", setId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("questions")
          .select(`
                id,
                text,
                answers (
                  id,
                  text,
                  points
                )
              `)
          .eq("set_id", setId);
        if (error) throw new Error(error.message);
        return data;
      },
    }),
  },
};
