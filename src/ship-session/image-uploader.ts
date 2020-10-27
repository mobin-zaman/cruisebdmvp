import * as imgbbUploader from 'imgbb-uploader';
import { ConfigService } from '@nestjs/config';

// ? NOTE: what about keeping images in the temp folder

export async function uploadImage(path: string) {
  const configService = new ConfigService();

  const apiKey = configService.get('IMAGE_BB_API_KEY');

  try {
    const imageBBResponse = await imgbbUploader(apiKey, path);
    // console.log('response: ', imageBBResponse);
    return imageBBResponse.url;
  } catch (e) {
    console.log('Problem in image uploader: ', e);
    throw e;
  }
}
