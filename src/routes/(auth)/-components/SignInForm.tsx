import { AuthError } from "@supabase/supabase-js";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  emailValidationRules,
  passwordValidationRules,
} from "../-utils/validationRules";
import { TextInput } from "./TextInput";

// TODO: add forgot password flow

const signInSchema = z.object({
  email: emailValidationRules,
  password: passwordValidationRules,
});

type SignInCredentials = z.infer<typeof signInSchema>;

type SignInFormProps = {
  onSubmit: (credentials: SignInCredentials) => Promise<void>;
  isLoading?: boolean;
};

export const SignInForm = ({
  onSubmit,
  isLoading = false,
}: SignInFormProps) => {
  const [onSubmitError, setOnSubmitError] = useState<string | null>(null);

  const form = useForm({
    validators: { onSubmit: signInSchema },
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setOnSubmitError(null);
        await onSubmit({
          email: value.email,
          password: value.password,
        });
      } catch (err) {
        if (err instanceof AuthError) {
          setOnSubmitError("Invalid email or password. Please try again.");
          return;
        }

        setOnSubmitError(
          "An unexpected error occurred, please refresh and try again",
        );
      }
    },
  });

  return (
    <>
      <h1 className="text-2xl font-bold">Sign in</h1>

      {onSubmitError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>{onSubmitError}</p>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.validate("submit");
          form.handleSubmit();
        }}
        className="flex flex-col gap-2"
      >
        <form.Field name="email" validators={{ onBlur: emailValidationRules }}>
          {(field) => (
            <TextInput
              label="Email"
              placeholder="your-email@example.com"
              type="email"
              field={{
                name: field.name,
                value: field.state.value,
                handleChange: field.handleChange,
                handleBlur: field.handleBlur,
              }}
              errorMsg={field.state.meta.errors?.[0]?.message}
              isDisabled={isLoading}
            />
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{ onBlur: passwordValidationRules }}
        >
          {(field) => (
            <TextInput
              label="Password"
              placeholder="Password"
              type="password"
              field={{
                name: field.name,
                value: field.state.value,
                handleChange: field.handleChange,
                handleBlur: field.handleBlur,
              }}
              errorMsg={field.state.meta.errors?.[0]?.message}
              isDisabled={isLoading}
            />
          )}
        </form.Field>

        <button
          type="submit"
          disabled={isLoading || form.state.isSubmitting}
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading || form.state.isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link to="/sign-up" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </>
  );
};
