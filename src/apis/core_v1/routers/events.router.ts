import { Router } from 'express';
import EventsController from '../events/controllers';
const eventsRouter: Router = Router();
const eventsController = new EventsController();

eventsRouter.post('/:event_id/editable/me', eventsController.editTableByMeController);
eventsRouter.post('/:event_id/editable/release', eventsController.editTableReleaseController);
eventsRouter.post('/:event_id/editable/maintain', eventsController.editTableMaintainController);

export default eventsRouter;
