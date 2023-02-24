import VoucherService from '../voucher/services';
import { runCronJobAll } from '../voucher/services';
export const cronJobApp = async () => {
  const Voucher = new VoucherService();
  await Promise.all([Voucher.runAllJob(), runCronJobAll()]);
};
