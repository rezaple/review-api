import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as logger from 'morgan';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as  path from 'path';
require('dotenv').config();

// import router
import UserRouter from './routers/UserRouter';
import AuthRouter from './routers/AuthRouter';
import TopicRouter from './routers/TopicRouter';
import ReviewRouter from './routers/ReviewRouter';
import AttachmentRouter from './routers/AttachmentRouter';

// server class
class Server {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public config() {
    this.app.use('/uploads', express.static(path.join(__dirname + '/uploads')));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(helmet());
    this.app.use(logger('dev'));
    this.app.use(compression());
    this.app.use(cors());
  }

  public routes():void {
    this.app.route('/').get((req, res) => {
      res.status(200).json('Review Topic REST API');
    });    
    
    this.app.use('/auth', AuthRouter);
    this.app.use('/users', UserRouter);
    this.app.use('/topics', TopicRouter);
    this.app.use('/reviews', ReviewRouter);
    this.app.use('/attachments', AttachmentRouter);
  }
}

export default new Server().app;