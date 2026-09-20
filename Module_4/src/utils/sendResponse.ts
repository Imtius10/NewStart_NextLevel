import { Response } from "express";

type TMeta = {
  page: number;
  limit: number;
  total: number;
};

type TResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: TMeta;
  errorDetails?: unknown;
};

export const sendResponse = <T>(
  res: Response,
  data: TResponse<T>
) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    ...(data.meta && { meta: data.meta }),
    ...(data.errorDetails !== undefined ? {
      errorDetails: data.errorDetails,
    } : {}),
  });
};