import * as FormData from "form-data";
import * as uuid from 'uuid'
import got from "got";

import { FileAccess } from "../data/fileAccess";
import { ImageDataAccess } from "../data/imageDataAccess";
import { Image } from "../model/domain/Image";
import { createLogger } from "../utils/logging/logger";

const dataAccess = new ImageDataAccess()
const fileAccess = new FileAccess()
const logger = createLogger('image business')

export async function getImages(userId: string) : Promise<Image[]> {
    return await dataAccess.getImages(userId)
}

export async function createImageAndPresignedUploadUrl(userId: string) : Promise<string> {
    const image = await createImage(userId)
    const url = await fileAccess.createPresignedUploadUrl(image.imageId)
    logger.info('created presigned url')
    return url
}

export async function deleteImage(imageId: string) {
    await dataAccess.deleteImage(imageId)
    await fileAccess.deleteImage(imageId)
}

export async function createPrediction(imageId: string){
    const formData = new FormData();
    logger.info("load image")
    formData.append('image', await fileAccess.getImage(imageId));
    logger.info("form data created")
    const url = "https://api.imagga.com/v2/tags?limit=3"
    const response = await got.post(url, {body: formData, username: process.env.IMAGGA_KEY, password: process.env.IMAGGA_SECRET})
    logger.info("response", response)
    const prediction = JSON.parse(response.body)
    await dataAccess.appendPrediction(imageId, prediction)
}

export async function createImage(userId: string): Promise<Image> {

    const id: string = uuid.v4()

    return await dataAccess.createImage({
        userId: userId,
        imageId: id,
        createdAt: new Date().toDateString(),
        imageUrl: fileAccess.createImageUrl(id),
        prediction: ""
    })
}