import mongoose from 'mongoose';

// Declare the Schema of the Mongo model
const eventSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    ipAddress: {
      type: String,
    },
    typeEvent: {
      type: String,
    },
    idEvent: {
      type: String,
    },
    timeEvent: {
      type: Date,
    },
    time_zone: {
      type: String,
    },
    isUpdate: {
      type: Boolean,
    },
    // expriedAt: {
    //   type: Date,
    //   default: Date.now(),
    //   index: true,
    //   expires: 300,
    // },
  },
  { timestamps: {} },
);

//Export the model
export default mongoose.model('Events', eventSchema);
