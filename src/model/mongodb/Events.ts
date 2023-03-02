import mongoose from 'mongoose';

// Declare the Schema of the Mongo model
const eventSchema = new mongoose.Schema(
  {
    typeEvent: {
      type: String,
      required: true,
    },
    maxiMumQuantity: {
      type: Number,
    },
  },
  { timestamps: {} },
);

//Export the model
export default mongoose.model('Event', eventSchema);
