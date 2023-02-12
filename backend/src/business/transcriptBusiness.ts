import { TranscriptDataAccess } from "../data/transcriptDataAccess";
import { Transcript } from "../model/domain/Transcript";

const dataAccess = new TranscriptDataAccess()

export async function getTranscripts(userId: string) : Promise<Transcript[]> {
    return dataAccess.getTranscripts(userId)
}