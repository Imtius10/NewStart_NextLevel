import { prisma } from "../../lib/prisma";
import GlobalError from "../../utils/GlobalError";
import { IRegister } from "./user.interface";
import httpStatus from 'http-status';
import bcrypt from "bcrypt"

const userRegisterDB = async (payload:IRegister) => { 


    const { name, email, password } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    });


    if (isUserExist) {
       throw new GlobalError(
      httpStatus.CONFLICT,
      "Email already registered"
    );
    }

    const hasspassword = await bcrypt.hash(password, 10);


    const CreatedUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hasspassword
        }
    });

    const user = await prisma.user.findUnique({
        where: {
            name: CreatedUser.name,
            email: CreatedUser.email
        },
        omit: {
            password: true
        }
    });


    return user
}



export const userService = {
    userRegisterDB
}