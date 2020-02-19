import { Request, Response, NextFunction } from 'express';
import auth from '../middlewares/AuthMiddleware';
import BaseRoutes from './BaseRoutes'
const models = require('../models/');

class UserRouter extends BaseRoutes {

  public async index(req: Request, res: Response): Promise<Response> {
    const { id } = req.app.locals.credential.data;
    const user = await models.User.findOne({
      where: {id},
      attributes: ['id','name','email','profile_picture']
    });
    return res.send({
      status:200,
      data: user
    });
  }

  public async test(req: Request, res: Response): Promise<Response> {
    return res.send(req.body);
  }

  routes() {
    this.router.get('/', auth, this.index);
    this.router.post('/test', this.test);
  }
}

const userRoutes = new UserRouter();
userRoutes.routes();

export default userRoutes.router;