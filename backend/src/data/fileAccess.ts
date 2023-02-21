import * as AWSXRAY from "aws-xray-sdk"

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

export class FileAccess {

    constructor(
        private readonly s3client : S3Client = AWSXRAY.captureAWSv3Client(new S3Client({})),
        private readonly bucketName: string = process.env.IMAGES_S3_BUCKET,
        private readonly urlExpiration: number = Number.parseInt(process.env.SIGNED_URL_EXPIRATION)
        )
    {}

    async createPresignedUploadUrl(imageId: string): Promise<string>{

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: imageId
        });
        
        return await getSignedUrl(this.s3client, command, { expiresIn: this.urlExpiration });
    }

    async deleteImage(imageId: string) { 

        const command = new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: imageId
        });

        await this.s3client.send(command);
    }

    createImageUrl(imageId: string): string{
        return `https://${this.bucketName}.s3.amazonaws.com/${imageId}`
    }

    async getImage(imageId: string): Promise<ReadableStream>{
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: imageId
        });

        const response = await this.s3client.send(command);
        return response.Body!
    }
}