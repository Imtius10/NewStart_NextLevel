import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { userService } from "./user.Service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';


const userRegister = catchAsync(async (req:Request,res:Response,next:NextFunction) => {
    const result = await userService.userRegisterDB(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Register Success",
        data:result
    })
});


const userLogin = catchAsync(async (req:Request,res:Response,next:NextFunction) => { 

    const result = await userService.LoginUserDB(req.body);


    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    // Refresh token cookie
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Login in success",
        data:result
    })
})

const getMyProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
    const userId = req.user?.id;
    const result = await userService.getMyProfile(userId as string);

    sendResponse(res, {
            success: true,
            statusCode: httpStatus.OK,
            message: "Profile retrieved successfully",
            data: result,
        });

})


const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        throw new Error("Refresh token not found");
    }

    const result = await userService.refreshToken(token);

    res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 15 * 60 * 1000,
    });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Access token refreshed successfully",
        data: result,
    });
})


const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Logged out successfully",
        data: null,
    });
})





export const userController = {
    userRegister,
    userLogin,
    getMyProfile,
    refreshToken,
    logout
}