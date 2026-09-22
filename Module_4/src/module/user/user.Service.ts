import { prisma } from "../../lib/prisma";
import GlobalError from "../../utils/GlobalError";
import { ILoggedIn, IRegister } from "./user.interface";
import httpStatus from 'http-status';
import bcrypt from "bcrypt"
import { createToken } from "../../utils/jwtUtils";

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


const LoginUserDB = async (payload: ILoggedIn) => { 

    const { email, password } = payload;
    const validUser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!validUser) {
        throw new Error("Email or password wrong");
    }

    const matchedPassword = await bcrypt.compare(password, validUser.password);

    if (!matchedPassword) {
        throw new Error("Wrong  password ");
    }


    const jwtPayload = {
        id: validUser.id,
        name: validUser.name,
        email: validUser.email,
        role:validUser.role
    }


    const accessToken = createToken(jwtPayload, "access");
      const refreshToken = createToken(
    {
      userId: validUser.id,
    },
    "refresh"
  );
    return {
        accessToken,
        refreshToken
    }

}


const getMyProfile = async (userId: string) => { 


    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        omit: {
            password: true
        }
    });


     if (!user) {
        throw new GlobalError(
            httpStatus.NOT_FOUND,
            "User not found"
        );
    }


    return user
}


const refreshToken = async (refreshTokenValue: string) => {
    const { verifyToken } = await import("../../utils/jwtUtils");

    const verified = verifyToken(refreshTokenValue, "refresh");

    if (!verified.success) {
        throw new GlobalError(
            httpStatus.UNAUTHORIZED,
            "Invalid or expired refresh token"
        );
    }

    const decoded = verified.data as { userId: string };

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
    });

    if (!user) {
        throw new GlobalError(
            httpStatus.NOT_FOUND,
            "User not found"
        );
    }

    if (user.activeStatus === "BLOCKED") {
        throw new GlobalError(
            httpStatus.FORBIDDEN,
            "Your account has been blocked"
        );
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const newAccessToken = createToken(jwtPayload, "access");

    return { accessToken: newAccessToken };
}


export const userService = {
    userRegisterDB,
    LoginUserDB,
    getMyProfile,
    refreshToken
}