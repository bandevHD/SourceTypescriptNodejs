import { Router } from 'express';
import {
  registerController,
  loginController,
  getListUserController,
  refreshTokenController,
  logoutController,
} from '../user/controllers';
import { verifyToken } from '../../modules/jwtService';
import UserController from '../user/controllers';
const userRouter: any = Router();
const userController = new UserController();

//Mongo db
userRouter.post('/register', registerController);
userRouter.post('/login', loginController);
userRouter.post('/refresh-token', refreshTokenController);
userRouter.delete('/logout', logoutController);
userRouter.get('/list-users', verifyToken, getListUserController);

//TypeOrm and mysql
//authecation
userRouter.post('/register-typeorm', userController.register);
userRouter.post('/login-typeorm', userController.login);
userRouter.post('/refresh-token-typeorm', userController.refreshToken);
userRouter.delete('/logout-typeorm', userController.logout);
userRouter.get('/list-users-typeorm', userController.getListUser);
userRouter.get('/get-one-users-typeorm/:id', userController.getOneUser);
userRouter.get('/list-users-html', userController.getListUserHtml);
userRouter.post('/:id/editable/me', userController.editTableByMe);

export default userRouter;
