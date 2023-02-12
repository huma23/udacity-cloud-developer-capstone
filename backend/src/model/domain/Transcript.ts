export interface Transcript {
    userId: string
    transcriptId: string
    createdAt: string
    name: string
    text: string
    status: Status
    audioFile: string
}