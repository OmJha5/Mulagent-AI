import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3.ts";
import "dotenv/config";

export const getFromS3 = async (
  filename: string,
  expiresIn = 600, // 10 minutes
): Promise<string> => {
  const bucketName = process.env.AWS_BUCKET_NAME;
  if (!bucketName) {
    throw new Error("Missing AWS_BUCKET_NAME environment variable");
  }

  return await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: bucketName,
      Key: filename,
    }),
    { expiresIn },
  );
};
