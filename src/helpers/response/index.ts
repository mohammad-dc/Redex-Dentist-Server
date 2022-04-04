import messages from "./messages";
import status from "./status";
import { Response } from "express";

// 400
const validationError = (res: Response, error: Error) =>
  res.status(status.BAD_REQUEST).json({
    success: false,
    message: error.message,
  });

const phoneWrong = (res: Response) =>
  res.status(status.BAD_REQUEST).json({
    success: true,
    message: messages.PHONE_WRONG,
  });

const passwordWrong = (res: Response) =>
  res.status(status.BAD_REQUEST).json({
    success: true,
    message: messages.PASSWORD_WRONG,
  });

const accountNotExist = (res: Response) =>
  res.status(status.NOT_FOUND).json({
    success: true,
    message: messages.ACCOUNT_NOT_EXIST,
  });

//200
const signupSuccess = (res: Response) =>
  res.status(status.CREATED).json({
    success: true,
    message: messages.SIGNUP_SUCCESS,
  });

const addedSuccess = (res: Response) =>
  res.status(status.CREATED).json({
    success: true,
    message: messages.ADDED_SUCCESS,
  });

const loginSuccess = (res: Response, result: any, token: string) =>
  res.status(status.OK).json({
    success: true,
    message: messages.LOGIN_SUCCESS,
    response: { result, token },
  });

const getSuccess = (res: Response, results: any, count?: number) =>
  res.status(status.OK).json({
    success: true,
    response: { results, count: count || 0 },
  });

//500
const somethingWentWrong = (res: Response, error: Error) =>
  res.status(status.INTERNAL_SERVER).json({
    success: false,
    message: messages.SOMETHING_WENT_WRONG,
    error,
  });

export default {
  validationError,
  signupSuccess,
  somethingWentWrong,
  loginSuccess,
  phoneWrong,
  passwordWrong,
  accountNotExist,
  addedSuccess,
  getSuccess,
};
