import { apiEndpoint } from '../config'
import { Transcript } from '../types/Transcript';
import { CreateTranscriptRequest } from '../types/CreateTranscriptRequest';
import Axios from 'axios'
import { UpdateTranscriptRequest } from '../types/UpdateTranscriptRequest';

export async function gettranscripts(idToken: string): Promise<Transcript[]> {
  console.log('Fetching transcripts')

  const response = await Axios.get(`${apiEndpoint}/transcripts`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('transcripts:', response.data)
  return response.data.items
}

export async function createtranscript(
  idToken: string,
  newtranscript: CreateTranscriptRequest
): Promise<Transcript> {
  const response = await Axios.post(`${apiEndpoint}/transcripts`,  JSON.stringify(newtranscript), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchtranscript(
  idToken: string,
  transcriptId: string,
  updatedtranscript: UpdateTranscriptRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/transcripts/${transcriptId}`, JSON.stringify(updatedtranscript), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deletetranscript(
  idToken: string,
  transcriptId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/transcripts/${transcriptId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  transcriptId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/transcripts/${transcriptId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
