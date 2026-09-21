import { NextFunction, Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { propertyService } from "./properties.Service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status';

const createProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 

    const { title, description, price, location } = req.body;

    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const property = await propertyService.createProperty({
      title,
      description,
      price: Number(price),
      location,
      landlordId: req.user.id,
    });

    // res.status(201).json({
    //   success: true,
    //   message: "Property created successfully",
    //   data: property,
    // });

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Register Success",
        data:property
    })
  

})
const getAllProperties = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
     async (req: Request, res: Response) => {
    const properties =
      await propertyService.getAllProperties();

   sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message:  "Properties retrieved successfully",
        data:properties
    })
  }

})
const getPropertyById = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 

    const { id } = req.params;

    const property = await propertyService.getPropertyById(id as string);


     sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property retrieved successfully",
        data:property
    })


})
const updateProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
     const { id } = req.params;

    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const { title, description, price, location } = req.body;

    const property = await propertyService.updateProperty(
        id as string,
        req.user.id,
        {
          title,
          description,
          price:
            price !== undefined
              ? Number(price)
              : undefined,
          location,
        }
    );
      sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message:  "Property updated successfully",
        data:property
    })

})
const deleteProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => { 
 const { id } = req.params;

    if (!req.user) {
      throw new Error("Unauthorized");
    }

   await propertyService.deleteProperty(
      id as string,
      req.user.id
    );

     sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message:  "Property Deleted successfully",
        data:null
    })

})



export const propertyController = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};