import express from 'express';
import { validateRequestBody } from '../../validators';
import { signUpSchema, signInSchema } from '../../validators/user.validators';
import { signupHandler, signinHandler, getProfileHandler } from '../../controllers/user.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const userRouter = express.Router();

userRouter.post("/signup", validateRequestBody(signUpSchema), signupHandler);
userRouter.post("/signin", validateRequestBody(signInSchema), signinHandler);

// Protected routes (authentication required)
userRouter.get("/me", authenticate, getProfileHandler);

export default userRouter;