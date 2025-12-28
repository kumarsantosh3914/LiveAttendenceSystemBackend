import express from 'express';
import { validateRequestBody } from '../../validators';
import { signUpSchema, signInSchema } from '../../validators/user.validators';
import { signupHandler, signinHandler } from '../../controllers/user.controller';

const userRouter = express.Router();

userRouter.post("/signup", validateRequestBody(signUpSchema), signupHandler);
userRouter.post("/signin", validateRequestBody(signInSchema), signinHandler);

export default userRouter;