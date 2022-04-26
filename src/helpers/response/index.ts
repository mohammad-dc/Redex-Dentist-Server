import { AR_MESSAGES, EN_MESSAGES } from "./messages";
import status from "./status";
import { Response } from "express";

// 400
const validationError = (res: Response, error: Error) =>
  res.status(status.BAD_REQUEST).json({
    success: false,
    message: error.message,
  });

const phoneWrong = (lang: string, res: Response) =>
  res.status(status.BAD_REQUEST).json({
    success: true,
    message: lang === "en" ? EN_MESSAGES.PHONE_WRONG : AR_MESSAGES.PHONE_WRONG,
  });

const passwordWrong = (lang: string, res: Response) =>
  res.status(status.BAD_REQUEST).json({
    success: true,
    message:
      lang === "en" ? EN_MESSAGES.PASSWORD_WRONG : AR_MESSAGES.PASSWORD_WRONG,
  });

const accountNotExist = (lang: string, res: Response) =>
  res.status(status.NOT_FOUND).json({
    success: true,
    message:
      lang === "en"
        ? EN_MESSAGES.ACCOUNT_NOT_EXIST
        : AR_MESSAGES.ACCOUNT_NOT_EXIST,
  });

const unauthorized = (lang: string, res: Response) =>
  res.status(status.UNAUTHORIZED).json({
    success: true,
    message:
      lang === "en" ? EN_MESSAGES.UNAUTHORIZED : AR_MESSAGES.UNAUTHORIZED,
  });

//200
const signupSuccess = (lang: string, res: Response) =>
  res.status(status.CREATED).json({
    success: true,
    message:
      lang === "en" ? EN_MESSAGES.SIGNUP_SUCCESS : AR_MESSAGES.SIGNUP_SUCCESS,
  });

const addedSuccess = (lang: string, res: Response) =>
  res.status(status.CREATED).json({
    success: true,
    message:
      lang === "en" ? EN_MESSAGES.ADDED_SUCCESS : AR_MESSAGES.ADDED_SUCCESS,
  });

const sendVerificationCodeSuccess = (lang: string, res: Response) =>
  res.status(status.CREATED).json({
    success: true,
    message:
      lang === "en"
        ? EN_MESSAGES.VERIFICATION_CODE_SENT
        : AR_MESSAGES.VERIFICATION_CODE_SENT,
  });

const updatedSuccess = (lang: string, res: Response) =>
  res.status(status.OK).json({
    success: true,
    message:
      lang === "en" ? EN_MESSAGES.UPDATED_SUCCESS : AR_MESSAGES.UPDATED_SUCCESS,
  });

const loginSuccess = (
  lang: string,
  res: Response,
  result: any,
  token: string
) =>
  res.status(status.OK).json({
    success: true,
    message:
      lang === "en" ? EN_MESSAGES.LOGIN_SUCCESS : AR_MESSAGES.LOGIN_SUCCESS,
    response: { result, token },
  });

const getSuccess = (res: Response, results: any, count?: number) =>
  res.status(status.OK).json({
    success: true,
    response: { results, count: count || 0 },
  });

//500
const somethingWentWrong = (lang: string, res: Response, error: Error) =>
  res.status(status.INTERNAL_SERVER).json({
    success: false,
    message:
      lang === "en"
        ? EN_MESSAGES.SOMETHING_WENT_WRONG
        : AR_MESSAGES.SOMETHING_WENT_WRONG,
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
  updatedSuccess,
  unauthorized,
  sendVerificationCodeSuccess,
};
