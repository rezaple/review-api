import {Request, Response, NextFunction} from 'express';
import {check, validationResult, ValidationError, Result } from 'express-validator';

const validate = [
    check('email').isString(),
    check('password').isLength({min:6}),
    (req: Request, res: Response, next: NextFunction) =>{
        const errors: Result<ValidationError> = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).send({errors: errors.array()})
        }

        next();
    }
];

export default validate;