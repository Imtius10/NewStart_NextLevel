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



export const userController = {
    userRegister
}