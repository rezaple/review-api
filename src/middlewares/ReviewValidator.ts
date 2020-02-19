import {Request, Response, NextFunction} from 'express';
import {check, validationResult, ValidationError, Result } from 'express-validator';

const validate = [
    check('comment').isString().isLength({ min: 20 }),
    check('rate').isNumeric().isLength({min:1,max:5}),
    (req: Request, res: Response, next: NextFunction) =>{
        const errors: Result<ValidationError> = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(422).send({errors: errors.array()})
        }

        next();
    }
];

export default validate;