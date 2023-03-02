export const createVoucher = [
  'title',
  'content',
  'description',
  'discount',
  'quantity',
  'startTimeAt',
  'endTimeAt',
  'isInactive',
  'isDelete',
];

export const contentEmailVoucher = (voucher) => ({
  TTILE: `${voucher.title}`,
  STARTTIME: `${voucher.startTimeAt}`,
  ENDTIME: `${voucher.endTimeAt}`,
  CONTENT: `${voucher.content}`,
});

export const contentStartSaleEmailVoucher = (voucher) => ({
  TTILE: `${voucher.title}`,
  STARTTIME: `${voucher.startTimeAt}`,
  ENDTIME: `${voucher.endTimeAt}`,
  CONTENT: `${voucher.content}`,
  COUNTDOWN: `Còn 30 phút nữa tới khuyến mãi hãy truy cập vào trang web của chúng tôi`,
});

export const contentEndSaleEmailVoucher = (voucher) => ({
  TTILE: `${voucher.title}`,
  STARTTIME: `${voucher.startTimeAt}`,
  ENDTIME: `${voucher.endTimeAt}`,
  CONTENT: `${voucher.content}`,
  COUNTDOWN: `Còn 30 phút nữa hết khuyến mãi của voucher này! Nhanh tay lên nào`,
});

export const experiAtEX: number = 365 * 24 * 60 * 60;
