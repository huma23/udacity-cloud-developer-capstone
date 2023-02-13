import { FileAccess } from "../data/fileAccess";
import { TranscriptDataAccess } from "../data/transcriptDataAccess";
import { Transcript } from "../model/domain/Transcript";
import { createLogger } from "../utils/logging/logger";

const dataAccess = new TranscriptDataAccess()
const fileAccess = new FileAccess()
const logger = createLogger('attachements business')


export async function getTranscripts(userId: string) : Promise<Transcript[]> {
    return dataAccess.getTranscripts(userId)
}

export async function createPresignedUploadUrl(todoId: string) : Promise<string> {
    const url = fileAccess.createPresignedUploadUrl(todoId)
    logger.info('created presigned url')
    return url
}