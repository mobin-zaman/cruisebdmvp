import axios from 'axios';
import fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';

const BASE_URL = 'https://api.html2pdf.app/v1/generate';

/**
 * This function is going to return the pathname/filename of the html file
 * the base path is defined in this function
 * @param html
 */
async function convertFromHtmlToPdf(html: string) {
  const configService = new ConfigService();

  const apiKey = configService.get('HTML_2_PDF_API_KEY');

  try {
    const data = {
      apiKey: apiKey,

      html,

      //TODO: margin top was 20 previously, if 25 works then 25 is going to be the default value
      marginTop: 25,
    };

    const response = await axios.post(BASE_URL, data, {
      responseType: 'stream',
    });

    //TODO: nanoid should go into a wrapper, and it should be in a folder called util
    const fileName = `${Date.now().toString()}-${nanoid()}.pdf`;

    response.data.pipe(fs.createWriteStream(fileName));

    // console.log("response: ", response);
    return fileName;
  } catch (e) {
    console.log('Error: ', e);
    throw e;
  }
}
