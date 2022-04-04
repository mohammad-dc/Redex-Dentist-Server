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

export const extractDataFromToken = (
  req: Request
): { user_id: string; role: string; user_name: string } => {
  const token = req.headers.authorization?.split(" ")[1];
  const {
    user_id,
    role,
    user_name,
  }: { user_id: string; role: string; user_name: string } = jwtDecode(
    token || ""
  );

  return { user_id, role, user_name };
};
