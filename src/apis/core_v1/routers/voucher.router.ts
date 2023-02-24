import { Router } from 'express';
import VoucherController, {
  createVoucherMongooseController,
  getListVoucherMongooseController,
  updateVoucherController,
  getOneVoucherMongooseController,
} from '../voucher/controllers';

const voucherRouter: any = Router();
const voucherController = new VoucherController();

//Create voucher mongoose
voucherRouter.post('/createVoucher', createVoucherMongooseController);
voucherRouter.get('/getListVoucher', getListVoucherMongooseController);
voucherRouter.get('/getOneVoucher/:id', getOneVoucherMongooseController);
voucherRouter.put('/updateVoucher', updateVoucherController);
//Restful APIs CRUD Voucher
voucherRouter.post('/create-voucher', voucherController.createController);
voucherRouter.put('/update-voucher', voucherController.updatePutController);
voucherRouter.patch('/update-voucher', voucherController.updatePathController);
voucherRouter.get('/get-list-voucher/:skip/:take', voucherController.readListController);
voucherRouter.get('/get-one-voucher/:id', voucherController.readOneController);
voucherRouter.delete('/delete-voucher', voucherController.deleteController);
voucherRouter.post('/:id/editable/me', voucherController.editVoucherByMe);

export default voucherRouter;
