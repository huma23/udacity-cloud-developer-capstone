export interface Transcript {
  userId: string
  transcriptId: string
  createdAt: string
  name: string
  text: string
  status: Status
  audioFile: string
}

enum Status {
  Processing = 0,
  Finished = 1,
  Error = 2
}
