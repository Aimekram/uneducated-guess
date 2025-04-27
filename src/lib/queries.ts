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
            questionsCount: questions(count)
          `);
        if (error) throw new Error(error.message);
        return data.map((set) => ({
          ...set,
          questionsCount: set.questionsCount?.[0]?.count ?? 0,
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
              questionsCount: questions(count)
            `)
          .eq("id", setId)
          .single();
        if (error) throw new Error(error.message);
        return {
          ...data,
          questionsCount: data.questionsCount?.[0]?.count ?? 0,
        };
      },
    }),
    updateById: (setId: string) => ({
      mutationFn: async ({ name }: { name: string }) => {
        const { data, error } = await supabase
          .from("question_sets")
          .update({ name })
          .eq("id", setId)
          .select()
          .single();
        if (error) throw new Error(error.message);
        return data;
      },
    }),
  },
  questions: {
    updateById: (questionId: string) => ({
      mutationFn: async ({ text }: { text: string }) => {
        const { data, error } = await supabase
          .from("questions")
          .update({ text })
          .eq("id", questionId);
        if (error) throw new Error(error.message);
        return data;
      },
    }),
  },
  answers: {
    create: (questionId: string) => ({
      mutationFn: async ({
        text,
        points,
      }: { text: string; points: number }) => {
        const { data, error } = await supabase
          .from("answers")
          .insert({ text, points, question_id: questionId })
          .select()
          .single();
        if (error) throw new Error(error.message);
        return data;
      },
    }),
    updateById: (answerId: string) => ({
      mutationFn: async ({
        text,
        points,
      }: { text: string; points: number }) => {
        const { data, error } = await supabase
          .from("answers")
          .update({ text, points })
          .eq("id", answerId)
          .select()
          .single();
        if (error) throw new Error(error.message);
        return data;
      },
    }),
    deleteById: {
      mutationFn: async ({ answerId }: { answerId: string }) => {
        const { data, error } = await supabase
          .from("answers")
          .delete()
          .eq("id", answerId);
        if (error) throw new Error(error.message);
        return data;
      },
    },
  },
  questionsWithAnswers: {
    queryKey: ["questionsWithAnswers"],
    getBySetId: (setId: string) => ({
      queryKey: ["questionsWithAnswers", "getBySetId", setId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("questions")
          .select(`
                id,
                setId:set_id,
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
