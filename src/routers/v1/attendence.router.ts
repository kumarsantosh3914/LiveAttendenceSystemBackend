import express from 'express';
import { validateRequestBody, validteQueryParams } from '../../validators';
import {
    createAttendanceSchema,
    updateAttendanceSchema,
    markAttendanceSchema,
    dateRangeQuerySchema,
} from '../../validators/attendence.validators';
import {
    createAttendanceHandler,
    getAllAttendanceHandler,
    getAttendanceByIdHandler,
    updateAttendanceHandler,
    deleteAttendanceHandler,
    getAttendanceByClassHandler,
    getAttendanceByStudentHandler,
    getAttendanceByClassAndStudentHandler,
    markAttendanceHandler,
    getClassStatisticsHandler,
    getAttendanceByDateRangeHandler,
} from '../../controllers/attendence.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const attendenceRouter = express.Router();

// All attendance routes require authentication
attendenceRouter.use(authenticate);

// CRUD Operations
attendenceRouter.post(
    '/',
    authorize(['teacher', 'admin']),
    validateRequestBody(createAttendanceSchema),
    createAttendanceHandler
);
attendenceRouter.get('/', getAllAttendanceHandler);

// More specific routes should come before parameterized routes
attendenceRouter.get('/class/:classId', getAttendanceByClassHandler);
attendenceRouter.get('/student/:studentId', getAttendanceByStudentHandler);
attendenceRouter.get('/class/:classId/student/:studentId', getAttendanceByClassAndStudentHandler);
attendenceRouter.get('/class/:classId/statistics', getClassStatisticsHandler);
attendenceRouter.get(
    '/class/:classId/date-range',
    validteQueryParams(dateRangeQuerySchema),
    getAttendanceByDateRangeHandler
);
attendenceRouter.post(
    '/class/:classId/student/:studentId/mark',
    authorize(['teacher', 'admin']),
    validateRequestBody(markAttendanceSchema),
    markAttendanceHandler
);
attendenceRouter.get('/:id', getAttendanceByIdHandler);
attendenceRouter.put(
    '/:id',
    authorize(['teacher', 'admin']),
    validateRequestBody(updateAttendanceSchema),
    updateAttendanceHandler
);
attendenceRouter.delete(
    '/:id',
    authorize(['teacher', 'admin']),
    deleteAttendanceHandler
);


export default attendenceRouter;
