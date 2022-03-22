import express, { NextFunction, Response, Request }  from 'express';

import { currentUser as user } from '@ticketnpm/common';

const router = express.Router();

router.get('/api/users/currentuser',user, (req: Request, res: Response, next: NextFunction) => {
  res.send({currentUser: req.currentUser || null});
});

export { router as currentUserRouter };
//rename router
/**
 * The reason we are renaming that export with this router as current 
 * user router is that we're going to
end up with many different routers inside 
of our application.
 */