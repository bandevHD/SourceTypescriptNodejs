import { Router } from 'express';
import VoucherController from '../voucher/controllers';
const voucherRouter: any = Router();
const voucherController = new VoucherController();

//Restful APIs CRUD Voucher
voucherRouter.post('/create-voucher', voucherController.createController);
voucherRouter.put('/update-voucher', voucherController.updatePutController);
voucherRouter.patch('/update-voucher', voucherController.updatePathController);
voucherRouter.get('/read-list-voucher', voucherController.readListController);
voucherRouter.get('/read-one-voucher/:id', voucherController.readOneController);
voucherRouter.delete('/delete-voucher', voucherController.deleteController);

export default voucherRouter;
