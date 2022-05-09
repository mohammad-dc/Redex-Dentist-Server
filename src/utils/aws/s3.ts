import fs from "fs";
import S3 from "aws-sdk/clients/s3";
import config from "../../config/config.config";

const s3 = new S3({
  region: config.aws.bucket.region as string,
  accessKeyId: config.aws.bucket.access_key as string,
  secretAccessKey: config.aws.bucket.secret_key as string,
});

//upload file to S3
export const uploadToS3 = async (file: { path: string; name: string }) => {
  const fileStream = await fs.createReadStream(file.path);
  const uploadParams: any = {
    Bucket: config.aws.bucket.name,
    Body: fileStream,
    Key: file.name,
    ACL: "public-read",
  };
  return s3.upload(uploadParams).promise();
};

export const deleteFileFromS3 = async (file_key: string) => {
  try {
    const deleteParams: any = {
      Key: file_key,
      Bucket: config.aws.bucket.name,
    };

    await s3.deleteObject(deleteParams).promise();
  } catch (error) {
    console.log("Error Delete From S3: ", error);
  }
};
