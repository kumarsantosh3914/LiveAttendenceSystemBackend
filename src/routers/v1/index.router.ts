import express from 'express';
import pingRouter from './ping.router';
import userRouter from './user.router';
import classRouter from './class.router';
import attendenceRouter from './attendence.router';

const v1Router = express.Router();

v1Router.use('/ping', pingRouter);
v1Router.use('/users', userRouter);
v1Router.use('/classes', classRouter);
v1Router.use('/attendence', attendenceRouter);

export default v1Router;
