import { Request } from "express";
import jwtDecode from "jwt-decode";
import jwt from "jsonwebtoken";
import config from "../config/config.config";

export const signJWT = (
  user_id: string,
  role: string,
  user_name: string,
  callback: (error: Error | null, token: string | null) => void
) => {
  try {
    jwt.sign(
      { user_id, role, user_name },
      config.jwt.user.secret || "",
      {
        issuer: config.jwt.user.issuer,
        algorithm: "HS256",
        expiresIn: "30d",
      },
      (error, token) => {
        if (error) {
          callback(error, null);
        } else if (token) {
          callback(null, token);
        }
      }
    );
  } catch (e) {
    callback(e as Error, null);
  }
};

export const signAdminJWT = (
  admin_id: string,
  email: string,
  callback: (error: Error | null, token: string | null) => void
) => {
  try {
    jwt.sign(
      { admin_id, email },
      config.jwt.admin.secret || "",
      {
        issuer: config.jwt.admin.issuer,
        algorithm: "HS256",
        expiresIn: "30d",
      },
      (error, token) => {
        if (error) {
          callback(error, null);
        } else if (token) {
          callback(null, token);
        }
      }
    );
  } catch (e) {
    callback(e as Error, null);
  }
};

export const extractDataFromToken = (
  req: Request
): { user_id: string; role: string; user_name: string } => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const {
      user_id,
      role,
      user_name,
    }: { user_id: string; role: string; user_name: string } = jwtDecode(
      token || ""
    );
    return { user_id, role, user_name };
  } else {
    return { user_id: "", role: "", user_name: "" };
  }
};

export const extractDataFromAdminToken = (
  req: Request
): { admin_id: string; email: string } => {
  const token = req.headers.authorization?.split(" ")[1];
  const { admin_id, email }: { admin_id: string; email: string } = jwtDecode(
    token || ""
  );

  return { admin_id, email };
};
