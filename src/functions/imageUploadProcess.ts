import sharp from "sharp";
import fs from "fs";
import util from "util";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { uploadToS3 } from "../utils/aws/s3";

const unlinkFile = util.promisify(fs.unlink);

export const imageUploadProcess = async (file: any) => {
  try {
    fs.access("./data/uploads", (error) => {
      if (error) {
        fs.mkdirSync("data/uploads");
      }
    });

    const extname = path.extname(file.originalname || "");
    const file_name = `redex-dentel-${uuidv4()}-${Date.now()}-${extname}`;
    const upload_path = `./data/uploads/${file_name}`;
    await sharp(file.buffer)
      .resize(500)
      .png({ quality: 50 })
      .toFile(upload_path);

    const result = await uploadToS3({
      path: upload_path,
      name: file_name,
    });

    await unlinkFile(upload_path);

    return result.Location;
  } catch (error) {
    console.log("image process error", error);
    throw error;
  }
};
