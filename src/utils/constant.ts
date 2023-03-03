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

export const findOneEventConstant = (data) => ({
  typeEvent: data.typeEvent,
  idEvent: data.idEvent,
  isUpdate: true,
});

export const updateOneEventConstant = (data) => ({
  typeEvent: data.typeEvent,
  idEvent: data.idEvent,
  userId: data.userId,
  isUpdate: true,
});

export const findOneAndUpdateConstant = (data) => ({
  typeEvent: data.typeEvent,
  idEvent: data.idEvent,
  userId: data.userId,
  isUpdate: true,
});

export const aggregateFindConstant = (data) => [
  {
    $match: {
      typeEvent: data.typeEvent,
      idEvent: data.idEvent,
      isUpdate: true,
    },
  },
  {
    $project: {
      datediff: {
        $dateDiff: {
          startDate: '$createdAt',
          endDate: data.timeEvent,
          unit: 'minute',
        },
      },
    },
  },
];
export const findVoucherAll = () => [
  { $match: { timediff: { $eq: 30 } } },
  {
    $project: {
      timediff: {
        $dateDiff: {
          startDate: { $toDate: '$startTimeAt' },
          endDate: new Date(),
          unit: 'minute',
        },
      },
    },
  },
];

export const nameJob = {
  sendEmailEndSalevoucher: 'sendEmailEndSalevoucher',
  sendEmailStartSalevoucher: 'sendEmailStartSalevoucher',
};

export const priorityNumber = {
  priority25: 25,
};

export const optionJob = {
  repeat: {
    every: 600000,
    limit: 100,
  },
  // removeOnComplete: true,
  // removeOnFail: true,
  // attempts: 3,
  // backoff: {
  //   type: 'exponential',
  //   delay: 1000,
  // },
};

export const optionRepeatJob = {
  repeat: {
    every: 60000,
    limit: 100,
  },
  priority: 1,
  removeOnComplete: true,
  removeOnFail: true,
};
