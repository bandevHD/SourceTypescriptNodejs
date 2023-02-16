import userRouter from './user.router';
import voucherRouter from './voucher.router';
import { Router } from 'express';

const baseRouter: any = Router();

baseRouter.use('/user', userRouter);
baseRouter.use('/voucher', voucherRouter);

export default baseRouter;