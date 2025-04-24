import { z } from "zod";

export const emailValidationRules = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

export const passwordValidationRules = z
  .string()
  .min(1, "Password is required")
  .min(6, "Password must be at least 6 characters")
  .regex(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must include uppercase, lowercase, and a number",
  );

export const confirmPasswordValidationRules = z
  .string()
  .min(1, "Please confirm your password");
