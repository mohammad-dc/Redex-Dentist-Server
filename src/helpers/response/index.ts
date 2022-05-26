import { AR_MESSAGES, EN_MESSAGES } from "./messages";
import status from "./status";
import { Response } from "express";
import { LangTypes } from "../../@types/app.type";

// 400
const validationError = (res: Response, error: Error) =>
  res.status(status.BAD_REQUEST).json({
    success: false,
    message: error.message,
  });

const phoneWrong = (lang: LangTypes, res: Response) =>
  res.status(status.BAD_REQUEST).json({
    success: false,
    message: lang === "en" ? EN_MESSAGES.PHONE_WRONG : AR_MESSAGES.PHONE_WRONG,
  });

const passwordWrong = (lang: LangTypes, res: Response) =>
  res.status(status.BAD_REQUEST).json({
    success: false,
    message:
      lang === "en" ? EN_MESSAGES.PASSWORD_WRONG : AR_MESSAGES.PASSWORD_WRONG,
  });

const accountNotExist = (lang: LangTypes, res: Response) =>
  res.status(status.NOT_FOUND).json({
    success: false,
    message:
      lang === "en"
        ? EN_MESSAGES.ACCOUNT_NOT_EXIST
        : AR_MESSAGES.ACCOUNT_NOT_EXIST,
  });

const unauthorized = (lang: LangTypes, res: Response) =>
  res.status(status.UNAUTHORIZED).json({
    success: false,
    message:
      lang === "en" ? EN_MESSAGES.UNAUTHORIZED : AR_MESSAGES.UNAUTHORIZED,
  });

const verificationCodeWrong = (lang: LangTypes, res: Response) =>
  res.status(status.BAD_REQUEST).json({
    success: false,
    message:
      lang === "en"
        ? EN_MESSAGES.VERIFICATION_CODE_WRONG
        : AR_MESSAGES.VERIFICATION_CODE_WRONG,
  });

const oldPasswordWrong = (lang: LangTypes, res: Response) =>
  res.status(status.BAD_REQUEST).json({
    success: false,
    message:
      lang === "en"
        ? EN_MESSAGES.OLD_PASSWORD_WRONG
        : AR_MESSAGES.OLD_PASSWORD_WRONG,
  });

const reservationNotAvailable = (lang: LangTypes, res: Response) =>
  res.status(status.NOT_ACCEPTABLE).json({
    success: false,
    message:
      lang === "en"
        ? EN_MESSAGES.RESERVATION_NOT_AVAILABLE
        : AR_MESSAGES.RESERVATION_NOT_AVAILABLE,
  });

const itemNotExist = (lang: LangTypes, res: Response) =>
  res.status(status.NOT_ACCEPTABLE).json({
    success: false,
    message:
      lang === "en" ? EN_MESSAGES.ITEM_NOT_EXIST : AR_MESSAGES.ITEM_NOT_EXIST,
  });

const emailNotExist = (lang: LangTypes, res: Response) =>
  res.status(status.NOT_ACCEPTABLE).json({
    success: false,
    message:
      lang === "en" ? EN_MESSAGES.EMAIL_NOT_EXIST : AR_MESSAGES.EMAIL_NOT_EXIST,
  });

//200
const signupSuccess = (lang: LangTypes, res: Response) =>
  res.status(status.CREATED).json({
    success: true,
    message:
      lang === "en" ? EN_MESSAGES.SIGNUP_SUCCESS : AR_MESSAGES.SIGNUP_SUCCESS,
  });

const addedSuccess = (lang: LangTypes, res: Response) =>
  res.status(status.CREATED).json({
    success: true,
    message:
      lang === "en" ? EN_MESSAGES.ADDED_SUCCESS : AR_MESSAGES.ADDED_SUCCESS,
  });

const sendVerificationCodeSuccess = (lang: LangTypes, res: Response) =>
  res.status(status.CREATED).json({
    success: true,
    message:
      lang === "en"
        ? EN_MESSAGES.VERIFICATION_CODE_SENT
        : AR_MESSAGES.VERIFICATION_CODE_SENT,
  });

const updatedSuccess = (lang: LangTypes, res: Response) =>
  res.status(status.OK).json({
    success: true,
    message:
      lang === "en" ? EN_MESSAGES.UPDATED_SUCCESS : AR_MESSAGES.UPDATED_SUCCESS,
  });

const loginSuccess = (
  lang: LangTypes,
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

const retrieveSuccess = (res: Response, result: any) =>
  res.status(status.OK).json({
    success: true,
    response: { result },
  });

const operationSuccess = (lang: LangTypes, res: Response) =>
  res.status(status.OK).json({
    success: true,
    message:
      lang === "en"
        ? EN_MESSAGES.OPERATION_SUCCESS
        : AR_MESSAGES.OPERATION_SUCCESS,
  });

const reservationCanceled = (lang: LangTypes, res: Response) =>
  res.status(status.OK).json({
    success: true,
    message:
      lang === "en"
        ? EN_MESSAGES.RESERVATION_CANCELED
        : AR_MESSAGES.RESERVATION_CANCELED,
  });

const reservationRejected = (lang: LangTypes, res: Response) =>
  res.status(status.OK).json({
    success: true,
    message:
      lang === "en"
        ? EN_MESSAGES.RESERVATION_REJECTED
        : AR_MESSAGES.RESERVATION_REJECTED,
  });

const reservationAccepted = (lang: LangTypes, res: Response) =>
  res.status(status.OK).json({
    success: true,
    message:
      lang === "en"
        ? EN_MESSAGES.RESERVATION_ACCEPTED
        : AR_MESSAGES.RESERVATION_ACCEPTED,
  });

const deletedSuccess = (lang: LangTypes, res: Response) =>
  res.status(status.ACCEPTED).json({
    success: true,
    message:
      lang === "en" ? EN_MESSAGES.DELETED_SUCCESS : AR_MESSAGES.DELETED_SUCCESS,
  });

//500
const somethingWentWrong = (lang: LangTypes, res: Response, error: Error) =>
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
  retrieveSuccess,
  updatedSuccess,
  deletedSuccess,
  unauthorized,
  sendVerificationCodeSuccess,
  verificationCodeWrong,
  operationSuccess,
  oldPasswordWrong,
  reservationNotAvailable,
  reservationCanceled,
  reservationRejected,
  reservationAccepted,
  itemNotExist,
  emailNotExist,
};
