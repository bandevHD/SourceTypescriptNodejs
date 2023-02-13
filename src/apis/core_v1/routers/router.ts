import userRouter from './user.router';
import { Router } from 'express';

const baseRouter: any = Router();

baseRouter.use('/user', userRouter);

export default baseRouter;
