import { Router, RequestHandler } from 'express';
import NBAController from '../controllers/NBAController';

export default function NBARouter(
  nbaController: NBAController = new NBAController(),
  router: Router = Router(),
): Router {
  router.get('/', (req, res, next) => {
    res.send('Hello World');
  });
  
  router.get('/draft-pick-counts/:teamId', nbaController.getDraftPickCountByTeamId as RequestHandler);

  return router;
}
