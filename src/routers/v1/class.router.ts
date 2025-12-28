import express from 'express';
import { validateRequestBody } from '../../validators';
import {
    createClassSchema,
    updateClassSchema,
    addStudentToClassSchema,
} from '../../validators/class.validators';
import {
    createClassHandler,
    getAllClassesHandler,
    getClassByIdHandler,
    getClassWithDetailsHandler,
    updateClassHandler,
    deleteClassHandler,
    getClassesByTeacherHandler,
    getClassesByStudentHandler,
    addStudentToClassHandler,
    removeStudentFromClassHandler,
} from '../../controllers/class.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const classRouter = express.Router();

// All class routes require authentication
classRouter.use(authenticate);

// CRUD Operations
classRouter.post(
    '/',
    authorize(['teacher', 'admin']),
    validateRequestBody(createClassSchema),
    createClassHandler
);
classRouter.get('/', getAllClassesHandler);

// More specific routes should come before parameterized routes
classRouter.get('/teacher/:teacherId', getClassesByTeacherHandler);
classRouter.get('/student/:studentId', getClassesByStudentHandler);
classRouter.get('/:id/details', getClassWithDetailsHandler);
classRouter.get('/:id', getClassByIdHandler);
classRouter.put(
    '/:id',
    authorize(['teacher', 'admin']),
    validateRequestBody(updateClassSchema),
    updateClassHandler
);
classRouter.delete(
    '/:id',
    authorize(['teacher', 'admin']),
    deleteClassHandler
);
// Student management routes
classRouter.post(
    '/:id/students',
    authorize(['teacher', 'admin']),
    validateRequestBody(addStudentToClassSchema),
    addStudentToClassHandler
);
classRouter.delete(
    '/:id/students/:studentId',
    authorize(['teacher', 'admin']),
    removeStudentFromClassHandler
);

export default classRouter;
