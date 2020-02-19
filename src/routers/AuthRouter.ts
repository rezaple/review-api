import {Response, Request} from 'express';
import BaseRoutes from './BaseRoutes';
import Authenticate from '../utils/Authenticate';
import validate from '../middlewares/AuthValidator';
const models = require('../models/');

class AuthRouter extends BaseRoutes{

    public async login (req: Request, res: Response):Promise<Response>{
        const {email, password} = req.body;

        const user = await models.User.findOne({
            where: {email}
        });
        
        if(user){
            const isAuthenticate: boolean = await  Authenticate.comparePassword(password, user.password);

            if(isAuthenticate){
                const token: string = await Authenticate.generateToken(user);
                res.status(200).send({token});
            }
        }
        
        return res.status(401).send({
            status: '401 Unauthenticated',
            message: 'Credentials not match in our data.'
        });
    }

    public routes(): void{
        this.router.post("/login", validate, this.login);
    }
}

export default new AuthRouter().router;