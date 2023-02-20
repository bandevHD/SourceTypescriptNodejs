import mongoose from 'mongoose';

// Declare the Schema of the Mongo model
const voucherSchema = new mongoose.Schema(
  {
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
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
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
