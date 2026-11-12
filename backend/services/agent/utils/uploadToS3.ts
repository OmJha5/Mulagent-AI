import { PutObjectCommand, type PutObjectCommandInput } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3.ts";
import "dotenv/config";

export const uploadToS3 = async (
  filename: string,
  buffer: NonNullable<PutObjectCommandInput["Body"]>,
  contentType: string,
): Promise<string> => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("Missing AWS_BUCKET_NAME environment variable");
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Body: buffer,
      Key: filename,
      ContentType: contentType,
    }),
  );

  return filename;
};
