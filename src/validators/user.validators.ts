import { z } from 'zod';

/**
 * Zod schema for validating user signup request
 * Enforces strong password requirements and email validation
 */
export const signUpSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must not exceed 50 characters")
        .trim(),
    email: z
        .string()
        .email("Invalid email format")
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must not exceed 50 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        ),
    role: z
        .enum(["student", "teacher", "admin"], {
            errorMap: () => ({ message: "Role must be one of: student, teacher, admin" }),
        })
        .optional()
        .default("student"),
});

/**
 * Zod schema for validating user signin request
 */
export const signInSchema = z.object({
    email: z
        .string()
        .email("Invalid email format")
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(1, "Password is required"),
});

/**
 * Type inferred from signUpSchema for TypeScript type safety
 */
export type SignUpValidationSchema = z.infer<typeof signUpSchema>;

/**
 * Type inferred from signInSchema for TypeScript type safety
 */
export type SignInValidationSchema = z.infer<typeof signInSchema>;

