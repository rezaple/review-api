import { Request, Response } from 'express';
import auth from '../middlewares/AuthMiddleware';
import BaseRoutes from './BaseRoutes';
const models = require('../models/');

class AttachmentRouter extends BaseRoutes {

  public async destroy(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.app.locals.credential.data;
    const { id } = req.params;

    try {
      const attach = await models.Attachment.findOne({
        where: { id },
        include: [{
          model: models.Review,
          as: 'review',
          required: true,
          where: { user_id },
          attributes: ['id', 'comment', 'rate', 'createdAt']
        }],
      });

      if (!attach) {
        throw {
          code: 404,
          name: 'NotFoundError',
          message: 'Attachment Not Found'
        };
      }
      const isdeleted = attach.destroy();
      return res.status(204).send('');
    } catch (e) {
      return res.status(e.code || 500).send({
        status: e.code,
        message: e.message
      });
    }
  }


  routes() {
    this.router.delete('/:id', auth, this.destroy);

  }
}

const attachRoutes = new AttachmentRouter();
attachRoutes.routes();

export default attachRoutes.router;