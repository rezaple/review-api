import { Request, Response } from 'express';
import auth from '../middlewares/AuthMiddleware';
import BaseRoutes from './BaseRoutes';
import validate from '../middlewares/ReviewValidator';
import {uploadImage} from '../middlewares/UploadMiddleware';
const models = require('../models/');

class TopicRouter extends BaseRoutes {

  public async index(req: Request, res: Response): Promise<Response> {
    const topics = await models.Topic.findAll({
      attributes:['id','name','description']
    })
    return res.send({
      status: 200,
      data: topics
    }).status(200);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const topic = await models.Topic.findOne({
      where: { id },
      include:[{
        model: models.Review,
        as: 'reviews', 
        required: false, 
        attributes:['id','comment','rate','createdAt'] ,
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
      }],
      attributes:['id','name','description']
    });

    if(!topic){
      return res.send({
        status : 404,
        message: 'Topic Not Found'
      }).status(404);
    }

    return res.send({
      status : 200,
      data: topic
    }).status(200);
  }

  public async storeReview(req: Request, res: Response): Promise<Response>{
      const { id: user_id } = req.app.locals.credential.data;
      const {comment, rate} = req.body;
      const { id: topic_id } = req.params;
      const files = req.files;
      const topic = await models.Topic.findOne({
        where: {id:topic_id}
      })

      if(!topic){
        return res.send({
          status:404,
          message: 'Topic tidak ditemukan.'
        }).status(404);
      }

      const hasReviewedTopic = await models.Review.findOne({
        where: {topic_id, user_id}
      });
      
      if(hasReviewedTopic){
        return res.send({
          status:400,
          message: 'Maaf Anda sudah memberikan review untuk topic ini.'
        }).status(400);
      }

      const review = await models.Review.create({
          topic_id,
          user_id,
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

      return res.send(review).status(201);
  }


  routes() {
    this.router.get('/', this.index);
    this.router.get('/:id', this.show);

    //remove validate
    this.router.post('/:id/review', auth,uploadImage,validate, this.storeReview);
  }
}

const topicRoutes = new TopicRouter();
topicRoutes.routes();

export default topicRoutes.router;