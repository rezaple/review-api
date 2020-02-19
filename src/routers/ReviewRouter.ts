import { Request, Response } from 'express';
import auth from '../middlewares/AuthMiddleware';
import BaseRoutes from './BaseRoutes';
import validate from '../middlewares/ReviewValidator';
import {uploadImage} from '../middlewares/UploadMiddleware';
const models = require('../models/');

class ReviewRouter extends BaseRoutes {

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { id: user_id } = req.app.locals.credential.data;
    const review = await models.Review.findOne({
      where: { id,user_id },
        include: [{
          model: models.User,
          as: 'user',
          required: false,
          attributes:['name','email','profile_picture']},{
          model: models.Attachment,
          as: 'attachments',
          required: false,
          attributes:['id','path']
        }],
      attributes:['id','comment','rate','createdAt']
    });

    if(!review){
      return res.send({
        status : 404,
        message: 'Review Not Found'
      }).status(404);
    }

    return res.send({
      status : 200,
      data: review
    }).status(200);
  }


  public async update(req: Request, res: Response): Promise<Response>{
      const { id: user_id } = req.app.locals.credential.data;
      const {comment, rate} = req.body;
      const { id } = req.params;
      const files = req.files;

      try {

        const review = await models.Review.findOne({
          where: {id, user_id}
        });
        
        if(!review){
          throw {
            code:404,
            name: 'NotFoundError',
            message: 'Review Not Found'
          };
        }
  
        const newData = await review.update({
            comment,
            rate
        });


      if(files.length > 0){
        for (var i = 0; i < files.length; i++) {
          const path = files[i].path.replace('build/','');
          const type = files[i].mimetype;
          const attach = await models.Attachment.create({
            review_id: review.id,
            type,
            path
          });
        }
      }

        return res.send({statu:200,data:newData}).status(200);        
      } catch (e) {
        res.status(500).send(e)
      }

  }

  public async destroy(req: Request, res: Response): Promise<Response>{
      const { id: user_id } = req.app.locals.credential.data;
      const { id } = req.params;

      try {
        const review = await models.Review.findOne({
          where: {id, user_id}
        });
        if(!review){
          throw {
            code:404,
            name: 'NotFoundError',
            message: 'Review Not Found'
          };
        }
        const isdeleted = review.destroy();  
        return res.status(204).send('');
      } catch (e) {
        return res.status(e.code||500).send({
          status: e.code,
          message: e.message
        });
      }
  }
  routes() {
    this.router.get('/:id', this.show);
    this.router.post('/:id/edit', auth,uploadImage,validate,this.update);
    this.router.delete('/:id', auth,this.destroy);
  }
}

const reviewRoutes = new ReviewRouter();
reviewRoutes.routes();

export default reviewRoutes.router;