import { Router } from 'express';
import { registerController, loginController, getListUserController } from '../user/controllers';
import { verifyToken } from '../../modules/jwtService';
const userRouter: any = Router();
// const userController = new UserController();

userRouter.post('/register', registerController);
userRouter.post('/login', loginController);
userRouter.get('/list-users', verifyToken, getListUserController);

export default userRouter;
