import { Voucher } from '../../../model/typeorm';

import dotenv from 'dotenv';

import {
  CreateVoucherType,
  DeleteBaseType,
  ReadOneVoucherType,
  UpdatePutVoucherType,
} from '../../../utils/types';

import { BaseService } from '../../base/base_service';

dotenv.config();

export default class VoucherService extends BaseService<typeof Voucher> {
  constructor() {
    super(Voucher);
  }
  //Restful APIs
  createVoucher = async (createVoucherType: CreateVoucherType) => {
    return await this.createService(createVoucherType);
  };

  readListVoucher = async () => {
    return await this.readListService();
  };

  readOneVoucher = async (readOneVoucherType: ReadOneVoucherType) => {
    readOneVoucherType.isDelete = false;
    return await this.readOneService(readOneVoucherType);
  };

  updatePutVoucher = async (id: string | number, updatePutVoucherType: UpdatePutVoucherType) => {
    console.table([id, updatePutVoucherType]);
    return await this.updatePutService(id, updatePutVoucherType);
  };

  deleteVoucher = async (id: string | number, deleteVoucherType: DeleteBaseType) => {
    return await this.deleteService(id, deleteVoucherType);
  };
}
