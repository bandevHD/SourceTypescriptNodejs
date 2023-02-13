import UserService from './services';

class UserController {
  userService: any;
  constructor() {
    this.userService = new UserService();
  }
  async register() {
    try {
      return await this.userService.userRegister();
    } catch (error) {
      console.log(error);
    }
  }
}

export default UserController;
