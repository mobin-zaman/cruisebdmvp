import axios from 'axios';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import * as path from 'path';
import { TICKET_DIRECTORY } from '../constants';

const BASE_URL = 'https://api.html2pdf.app/v1/generate';

/**
 * This function is going to return the pathname/filename of the html file
 * the base path is defined in this function
 * @param html
 */
export default async function convertFromHtmlToPdf(html: string) {
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

    console.log('Filename of the pdf: ', fileName);

    // const TICKET_DIR = path.join(process.cwd(), 'tickets');

    const filePath = path.join(TICKET_DIRECTORY, fileName);

    response.data.pipe(fs.createWriteStream(filePath));

    // console.log("response: ", response);
    return filePath;
  } catch (e) {
    console.log('Error: ', e);
    throw e;
  }
}
