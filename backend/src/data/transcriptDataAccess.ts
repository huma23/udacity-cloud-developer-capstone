import * as AWSXRAY from "aws-xray-sdk"

import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Transcript } from "../model/domain/Transcript";

export class TranscriptDataAccess {

    constructor(
        private readonly docClient : DynamoDBDocument = AWSXRAY.captureAWSv3Client(DynamoDBDocument.from(new DynamoDBClient({}))),
        private readonly transcriptTable = process.env.TRANSCRIPT_TABLE,
        private readonly transcriptCreatedAtIndex = process.env.TRANSCRIPT_CREATED_AT_INDEX
    ){}

    async getTranscripts(userId: string): Promise<Transcript[]>{
        const result = await this.docClient.query({
            TableName: this.transcriptTable,
            IndexName: this.transcriptCreatedAtIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        });
        
        const todos = result.Items as Transcript[];
        return todos
    }
}