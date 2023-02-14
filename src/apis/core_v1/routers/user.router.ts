import { Router } from 'express';
import {
  registerController,
  loginController,
  getListUserController,
  registerControllerTypeOrm,
} from '../user/controllers';
import { verifyToken } from '../../modules/jwtService';
const userRouter: any = Router();
// const userController = new UserController();

//Mongo db
userRouter.post('/register', registerController);
userRouter.post('/login', loginController);
userRouter.get('/list-users', verifyToken, getListUserController);

//TypeOrm and mysql
userRouter.post('/register-typeorm', registerControllerTypeOrm);
userRouter.post('/login-typeorm', loginController);
userRouter.get('/list-users-typeorm', verifyToken, getListUserController);

export default userRouter;
