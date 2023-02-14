import { register, login, getList } from './services';
import { Request, Response } from 'express';

export async function registerController(req: Request, res: Response) {
  return await register(req, res);
}

export async function loginController(req: Request, res: Response) {
  return await login(req, res);
}

export async function getListUserController(req: Request, res: Response) {
  return await getList(req, res);
}

// class UserController {
//   constructor() {
//     this.userService = new UserService();
//   }
//   userService;
//   async register(req: Request, res: Response) {
//     try {
//       console.log(req.body);
//       return await this.userService.userRegister(req, res);
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// export default UserController;
