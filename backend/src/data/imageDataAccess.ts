import * as AWSXRAY from "aws-xray-sdk"

import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Image } from "../model/domain/Image";

export class ImageDataAccess {

    constructor(
        private readonly docClient : DynamoDBDocument = AWSXRAY.captureAWSv3Client(DynamoDBDocument.from(new DynamoDBClient({}))),
        private readonly imageTable = process.env.IMAGES_TABLE,
        private readonly imageCreatedAtIndex = process.env.IMAGES_CREATED_AT_INDEX
    ){}

    async getImages(userId: string): Promise<Image[]>{
        const result = await this.docClient.query({
            TableName: this.imageTable,
            IndexName: this.imageCreatedAtIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        });
        
        const images = result.Items as Image[];
        return images
    }

    async deleteImage(imageId: string): Promise<void> {
        await this.docClient.delete({
            TableName: this.imageTable,
            Key: {
                imageId: imageId
            }
        });
    }

    async appendPrediction(imageId: string, prediction: any){
        await this.docClient.update({
            TableName: this.imageTable,
            Key: {
                imageId: imageId
            },
            UpdateExpression: 'set prediction = :prediction',
            ExpressionAttributeValues:{
                ':prediction': prediction
            }
        })
    }

    async createImage(imageItem: Image): Promise<Image> {
        await this.docClient.put({
            TableName: this.imageTable,
            Item: imageItem
        })

        return imageItem
    }
}