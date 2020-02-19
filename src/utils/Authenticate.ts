import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

interface UserDataObject {
    id: Number;
    name: string;
    email: string;
}

class Authenticate {
    public static hashPassword = (password: string): Promise<string> => {
        return bcrypt.hash(password,10);
    }

    public  static  comparePassword = async(password:string, hashedPassword: string):Promise<boolean>=>{
        const result: boolean = await bcrypt.compare(password, hashedPassword);
        return result;
    }

    public static generateToken = async ({id, name, email}: UserDataObject): Promise<string>=>{
        const secretKey: string = process.env.SECRET_KEY || 'secretKey'
        const token: string = await jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            data: {id,name,email}
        },secretKey );
        return token;
    }
}

export default Authenticate;