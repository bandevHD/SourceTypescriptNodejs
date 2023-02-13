import { Router } from 'express';
import UserController from '../user/controllers';
const userRouter: any = Router();
const userController = new UserController();

userRouter.get('/user', userController.register);

export default userRouter;
