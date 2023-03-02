export const createVoucher = {
  title: 'Giảm giá khuyến mãi ngày valentine 2',
  content: 'Ok',
  description: 'Ok',
  discount: '1233',
  quantity: 12,
  startTimeAt: '2023-02-20 23:34',
  endTimeAt: '2023-02-20 23:23',
  isInactive: 'false',
  isDelete: 'false',
};

export const updateVoucherBodyNotFound = {
  _id: '13f745ec6bd17872ce704dd7',
  title: 'Giảm giá khuyến mãi ngày 24-2-2023',
  content: 'Ok',
  description: 'Ok',
  discount: '1233',
  quantity: 12,
  startTimeAt: '2023-02-24 11:58',
  endTimeAt: '2023-02-24 23:23',
  isInactive: 'false',
  isDelete: 'false',
};

export const deleteVoucherBodyNotFound = {
  _id: '13f745ec6bd17872ce704dd7',
};

export const updateVoucherBodySuccess = (voucher) => ({
  code: voucher.code,
  title: voucher.title,
  content: voucher.content,
  description: voucher.description,
  discount: voucher.discount,
  quantity: voucher.quantity,
  startTimeAt: voucher.startTimeAt,
  endTimeAt: voucher.endTimeAt,
  isInactive: voucher.isInactive,
  isDelete: voucher.isDelete,
  _id: voucher._id,
});
