import dotenv from 'dotenv';
import moment from 'moment';
import mongoose, { ClientSession, UpdateWriteOpResult } from 'mongoose';
import { Response } from 'express';
import { RESPONSES } from '../../../utils/HttpStatusResponseCode';
import * as _ from 'lodash';
import EventUser from '../../../model/mongodb/Event';
import {
  aggregateFindConstant,
  findOneAndUpdateConstant,
  findOneEventConstant,
  updateOneEventConstant,
} from '../../../utils/constant';

dotenv.config();

const { MONGODB_ATLAS } = process.env;

export default class EventsService {
  editVoucherByMe = async (data): Promise<string> => {
    try {
      const findOneEvent = await EventUser.aggregate(aggregateFindConstant(data));
      if (findOneEvent[0]['datediff'] < 5) return RESPONSES.CONFLICT.NOT_ALLOWED_ACCESS_EDIT_EVENT;
      await EventUser.findOneAndUpdate(
        findOneAndUpdateConstant(data),
        {
          ...data,
          isUpdate: true,
        },
        { upsert: true, new: true },
      );
      return RESPONSES.OK.ALLOWED_ACCESS_EDIT_EVENT;
    } catch (error) {
      throw error;
    }
  };

  editVoucherRelease = async (data): Promise<string> => {
    try {
      const findOneEvent: UpdateWriteOpResult = await EventUser.updateOne(
        updateOneEventConstant(data),
        { isUpdate: false },
      );
      if (findOneEvent.matchedCount == 0) return RESPONSES.NOT_FOUND.EVENT_NOT_FOUND;
      return RESPONSES.OK.RELEASE_EDITTABLE_EVENT;
    } catch (error) {
      throw error;
    }
  };

  editVoucherMaintain = async (data): Promise<string> => {
    const conn = await mongoose.connect(MONGODB_ATLAS);
    const session: ClientSession = await conn.startSession();
    session.startTransaction({
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    });
    try {
      const result = await EventUser.aggregate(aggregateFindConstant(data), { session });
      if (result.length == 0 || result[0]['datediff'] > 5) {
        await EventUser.updateOne(updateOneEventConstant(data), { isUpdate: false });
        return RESPONSES.UNAUTHORIZED.NOT_ALLOWED_EDIT_EVENT;
      }
      await EventUser.updateOne(updateOneEventConstant(data), { timeEvent: data.timeEvent });
      await session.commitTransaction();
      return RESPONSES.OK.MAINTAIN_EDITTABLE_EVENT_SUCCESS;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  };
}
