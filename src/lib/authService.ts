import { supabase } from "./supabase";

export const authService = {
  signIn: (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  },

  signUp: (email: string, password: string) => {
    return supabase.auth.signUp({ email, password });
  },

  signOut: async () => {
    return supabase.auth.signOut();
  },

  resetPassword: (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  },

  updatePassword: (password: string) => {
    return supabase.auth.updateUser({ password });
  },
};
