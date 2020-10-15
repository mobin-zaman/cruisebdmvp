import axios from 'axios';

export async function html2json(data: string) {
  const BASE_URL = 'https://html2json.com/api/v1';

  try {
    const response = await axios.post(BASE_URL, data);
    console.log('response from html2json: ', response.data.data.links);
    return response;
  } catch (e) {
    console.log('error in axios: ', e.message);
  }
}
