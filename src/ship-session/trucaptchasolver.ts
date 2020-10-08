import * as fs from 'fs';
import axios from 'axios';

export default async function solveCaptcha(path) {
  function base64_encode(file) {
    const bitmap = fs.readFileSync(file);
    return Buffer.from(bitmap).toString('base64');
  }

  const base64str = base64_encode(path);
  const url = 'https://api.apitruecaptcha.org/one/gettext';

  const body = {
    userid: 'metalzaman',
    apikey: 'JGMPxCA4x9abw2k9fsQA',
    // data: b64
    data: base64str,
  };

  const response = await axios.post(url, body);

  return response.data.result;
}
