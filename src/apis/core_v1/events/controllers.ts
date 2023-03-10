import { NextFunction, Request, Response } from 'express';
import * as _ from 'lodash';
import EventsService from './services';
import { RESPONSES } from '../../../utils/HttpStatusResponseCode';
import moment from 'moment';

class EnventsController {
  eventsService: EventsService;
  constructor() {
    this.eventsService = new EventsService();
  }

  getTimeZone = () => {
    const offset: number = new Date().getTimezoneOffset();
    const o: number = Math.abs(offset);
    return (
      (offset < 0 ? '+' : '-') +
      ('00' + Math.floor(o / 60)).slice(-2) +
      ':' +
      ('00' + (o % 60)).slice(-2)
    );
  };

  editTableByMeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const time_zone: string = this.getTimeZone();
      const timeEvent: Date = new Date();
      const idEvent: string = req.params.event_id;
      const ipAddress: string = req.header('x-forwarded-for') || req.connection.remoteAddress;
      const result: string = await this.eventsService.editVoucherByMe({
        ...req.body,
        idEvent,
        ipAddress,
        time_zone,
        timeEvent,
      });
      res.status(200).send({
        statusCode: result,
      });
    } catch (error) {
      next(error);
    }
  };

  editTableReleaseController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idEvent: string = req.params.event_id;
      const result: string = await this.eventsService.editVoucherRelease({
        ...req.body,
        idEvent,
      });
      res.status(200).send({
        statusCode: result,
      });
    } catch (error) {
      next(error);
    }
  };

  editTableMaintainController = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const idEvent: string = req.params.event_id;
      const timeEvent = new Date();
      const result: string = await this.eventsService.editVoucherMaintain({
        ...req.body,
        idEvent,
        timeEvent,
      });
      res.status(200).send({
        statusCode: result,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default EnventsController;
