import { AuthError } from "@supabase/supabase-js";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  confirmPasswordValidationRules,
  emailValidationRules,
  passwordValidationRules,
} from "../-utils/validationRules";
import { TextInput } from "./TextInput";

const signUpSchema = z
  .object({
    email: emailValidationRules,
    password: passwordValidationRules,
    confirmPassword: confirmPasswordValidationRules,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords need to match",
    path: ["confirmPassword"],
  });

type SignUpCredentials = z.infer<typeof signUpSchema>;

type SignUpFormProps = {
  onSubmit: (
    credentials: Omit<SignUpCredentials, "confirmPassword">,
  ) => Promise<void>;
  isLoading?: boolean;
};

export const SignUpForm = ({
  onSubmit,
  isLoading = false,
}: SignUpFormProps) => {
  const [onSubmitError, setOnSubmitError] = useState<string | null>(null);

  const form = useForm({
    validators: { onSubmit: signUpSchema },
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setOnSubmitError(null);
        await onSubmit({ email: value.email, password: value.password });
      } catch (err) {
        if (err instanceof AuthError) {
          // TODO: handle already existing email

          setOnSubmitError(
            "Couldn't sign you up, please refresh and try again",
          );
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
      <h1 className="text-2xl font-bold">Create an account</h1>

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

        <form.Field
          name="confirmPassword"
          validators={{ onBlur: confirmPasswordValidationRules }}
        >
          {(field) => (
            <TextInput
              label="Confirm Password"
              placeholder="Confirm Password"
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

        <div className="mt-2">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit || isLoading}
                className="w-full bg-blue-500 text-white rounded p-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            )}
          </form.Subscribe>
        </div>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/sign-in" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </>
  );
};
