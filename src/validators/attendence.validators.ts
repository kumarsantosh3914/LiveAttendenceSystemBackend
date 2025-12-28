import { z } from 'zod';

/**
 * Zod schema for validating attendance creation request
 */
export const createAttendanceSchema = z.object({
    classId: z
        .string()
        .min(1, "Class ID is required"),
    studentId: z
        .string()
        .min(1, "Student ID is required"),
    status: z
        .enum(["present", "absent"], {
            errorMap: () => ({ message: "Status must be 'present' or 'absent'" }),
        })
        .default("absent"),
});

/**
 * Zod schema for validating attendance update request
 */
export const updateAttendanceSchema = z.object({
    classId: z
        .string()
        .min(1, "Class ID is required")
        .optional(),
    studentId: z
        .string()
        .min(1, "Student ID is required")
        .optional(),
    status: z
        .enum(["present", "absent"], {
            errorMap: () => ({ message: "Status must be 'present' or 'absent'" }),
        })
        .optional(),
});

/**
 * Zod schema for validating mark attendance request
 */
export const markAttendanceSchema = z.object({
    status: z
        .enum(["present", "absent"], {
            errorMap: () => ({ message: "Status must be 'present' or 'absent'" }),
        }),
});

/**
 * Zod schema for validating date range query parameters
 */
export const dateRangeQuerySchema = z.object({
    startDate: z
        .string()
        .min(1, "Start date is required")
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "Start date must be a valid date",
        }),
    endDate: z
        .string()
        .min(1, "End date is required")
        .refine((date) => !isNaN(Date.parse(date)), {
            message: "End date must be a valid date",
        }),
});

/**
 * Type inferred from createAttendanceSchema for TypeScript type safety
 */
export type CreateAttendanceValidationSchema = z.infer<typeof createAttendanceSchema>;

/**
 * Type inferred from updateAttendanceSchema for TypeScript type safety
 */
export type UpdateAttendanceValidationSchema = z.infer<typeof updateAttendanceSchema>;

/**
 * Type inferred from markAttendanceSchema for TypeScript type safety
 */
export type MarkAttendanceValidationSchema = z.infer<typeof markAttendanceSchema>;

/**
 * Type inferred from dateRangeQuerySchema for TypeScript type safety
 */
export type DateRangeQueryValidationSchema = z.infer<typeof dateRangeQuerySchema>;

