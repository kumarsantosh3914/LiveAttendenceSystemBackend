import { z } from 'zod';

/**
 * Zod schema for validating class creation request
 */
export const createClassSchema = z.object({
    className: z
        .string()
        .min(3, "Class name must be at least 3 characters")
        .max(50, "Class name must not exceed 50 characters")
        .trim(),
    teacherId: z
        .string()
        .min(1, "Teacher ID is required"),
    studentIds: z
        .array(z.string())
        .optional()
        .default([]),
});

/**
 * Zod schema for validating class update request
 */
export const updateClassSchema = z.object({
    className: z
        .string()
        .min(3, "Class name must be at least 3 characters")
        .max(50, "Class name must not exceed 50 characters")
        .trim()
        .optional(),
    teacherId: z
        .string()
        .min(1, "Teacher ID is required")
        .optional(),
    studentIds: z
        .array(z.string())
        .optional(),
});

/**
 * Zod schema for validating add student to class request
 */
export const addStudentToClassSchema = z.object({
    studentId: z
        .string()
        .min(1, "Student ID is required"),
});

/**
 * Type inferred from createClassSchema for TypeScript type safety
 */
export type CreateClassValidationSchema = z.infer<typeof createClassSchema>;

/**
 * Type inferred from updateClassSchema for TypeScript type safety
 */
export type UpdateClassValidationSchema = z.infer<typeof updateClassSchema>;

/**
 * Type inferred from addStudentToClassSchema for TypeScript type safety
 */
export type AddStudentToClassValidationSchema = z.infer<typeof addStudentToClassSchema>;

