import { apiEndpoint } from '../config'
import { Prediction } from '../types/Prediction';
import Axios from 'axios'

export async function getimages(idToken: string): Promise<Prediction[]> {
  console.log('Fetching images')

  const response = await Axios.get(`${apiEndpoint}/images`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('images:', response.data)
  return response.data.items
}

export async function deleteimage(
  idToken: string,
  imageId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/images/${imageId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/images`, '', {
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
