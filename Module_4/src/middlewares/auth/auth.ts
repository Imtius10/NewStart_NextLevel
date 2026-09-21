import { NextFunction, Request, Response } from "express";
import GlobalError from "../../utils/GlobalError";
import httpStatus from 'http-status';
import jwt,{ JsonWebTokenError } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";


export interface IAuthUser {
    id: string;
    email: string;
    role: "TENANT" | "LANDLORD" | "ADMIN";
}

declare global {
    namespace Express {
        interface Request {
            user?: IAuthUser;
        }
    }
}


const auth =catchAsync( async (req: Request, res: Response, next: NextFunction) => { 
    const token = req.cookies?.accessToken;


    if (!token) {
        throw new GlobalError(httpStatus.INTERNAL_SERVER_ERROR, "You are not authorized");
    }

    const secret = process.env.JWT_ACCESS_SECRET as string;
    const decoded = jwt.verify(token, secret) as IAuthUser;

    req.user = decoded;
    next();

    
}
)


export default auth