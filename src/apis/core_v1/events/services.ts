import dotenv from 'dotenv';
import moment from 'moment';
import mongoose, { ClientSession, UpdateWriteOpResult } from 'mongoose';
import { Response } from 'express';
import { RESPONSES } from '../../../utils/HttpStatusResponseCode';
import * as _ from 'lodash';
import EventUser from '../../../model/mongodb/Event';

dotenv.config();

const { MONGODB_ATLAS } = process.env;

export default class EventsService {
  editTableByMe = async (data): Promise<string> => {
    try {
      const findOneEvent = await EventUser.findOne({
        typeEvent: data.typeEvent,
        idEvent: data.idEvent,
        isUpdate: true,
      });

      if (findOneEvent) return RESPONSES.CONFLICT.NOT_ALLOWED_ACCESS_EDIT_EVENT;
      await EventUser.findOneAndUpdate(
        { typeEvent: data.typeEvent },
        {
          ...data,
          isUpdate: true,
        },
        { upsert: true, new: true },
      );
      return RESPONSES.OK.ALLOWED_ACCESS_EDIT_EVENT;
    } catch (error) {
      console.log(error);
    }
  };

  editTableRelease = async (data): Promise<string> => {
    try {
      const findOneEvent: UpdateWriteOpResult = await EventUser.updateOne(
        {
          typeEvent: data.typeEvent,
          idEvent: data.idEvent,
          userId: data.userId,
          isUpdate: true,
        },
        { isUpdate: false },
      );
      if (findOneEvent.matchedCount == 0) return RESPONSES.NOT_FOUND.EVENT_NOT_FOUND;
      return RESPONSES.OK.RELEASE_EDITTABLE_EVENT;
    } catch (error) {
      console.log(error);
    }
  };

  editTableMaintain = async (data): Promise<string> => {
    const conn = await mongoose.connect(MONGODB_ATLAS);
    const session: ClientSession = await conn.startSession();
    session.startTransaction({
      readPreference: 'primary',
      readConcern: { level: 'local' },
      writeConcern: { w: 'majority' },
    });
    try {
      const result = await EventUser.aggregate(
        [
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
        ],
        { session },
      );

      if (result[0].datediff > 5) {
        await EventUser.updateOne(
          {
            typeEvent: data.typeEvent,
            idEvent: data.idEvent,
            userId: data.userId,
            isUpdate: true,
          },
          { isUpdate: false },
        );
        return RESPONSES.UNAUTHORIZED.NOT_ALLOWED_EDIT_EVENT;
      }

      await EventUser.updateOne(
        {
          typeEvent: data.typeEvent,
          idEvent: data.idEvent,
          userId: data.userId,
          isUpdate: true,
        },
        { timeEvent: data.timeEvent },
      );
      await session.commitTransaction();
      return RESPONSES.OK.MAINTAIN_EDITTABLE_EVENT_SUCCESS;
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
    } finally {
      await session.endSession();
    }
  };
}
