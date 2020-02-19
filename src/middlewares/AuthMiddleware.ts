import {Request , Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';

const auth = (req: Request, res: Response, next: NextFunction):void | Response =>{
    try {
        if(!req.headers.authorization ){
            throw {
                name: 'EmptyTokenError',
                message: 'invalid token'
            };  
        }
    
        const secretKey: string = process.env.SECRET_KEY || 'secretKey';
        const token:string = req.headers.authorization.split(" ")[1];
    
        const credential: string | object = jwt.verify(token,secretKey);
        if(credential){
            req.app.locals.credential = credential;
            return next();
        } 
    } catch (error) {
        return res.status(401).send({
            status: '401 Unauthenticated',
            error
        }) 
    }
}

export default auth;