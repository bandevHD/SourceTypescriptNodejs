import mongoose from 'mongoose';

// Declare the Schema of the Mongo model
const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    description: {
      type: String,
    },
    discount: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    maxiMumQuantity: {
      type: Number,
      requied: true,
    },
    startTimeAt: {
      type: String,
      required: true,
    },
    endTimeAt: {
      type: String,
      required: true,
    },
    isInactive: {
      type: Boolean,
      required: true,
    },
    isDelete: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: {} },
);

//Export the model
export default mongoose.model('Voucher', voucherSchema);
