import * as AWSXRAY from "aws-xray-sdk"

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export class FileAccess {

    constructor(
        private readonly s3client : S3Client = AWSXRAY.captureAWSv3Client(new S3Client({})),
        private readonly bucketName: string = process.env.ATTACHMENT_S3_BUCKET,
        private readonly urlExpiration: number = Number.parseInt(process.env.SIGNED_URL_EXPIRATION)
        )
    {}

    async createPresignedUploadUrl(todoId: string): Promise<string>{

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: todoId
        });
        
        return await getSignedUrl(this.s3client, command, { expiresIn: this.urlExpiration });
    }
}