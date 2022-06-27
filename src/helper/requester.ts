import axios from 'axios';

export default class Requester {

  get(url: string): Promise<any> {
    return axios.get(url);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  post(url: string, input: any): Promise<any> {
    return axios.post(url, input);
  }
}
