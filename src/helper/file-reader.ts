import * as fs from 'fs';

export default class FileReader {
  static readonly filePath = 'client-requests.txt';

  readRequestFile(): string {
    return fs.readFileSync(FileReader.filePath, { encoding: 'utf8', flag: 'r' });
  }

  writeToRequestFile(text: string): void {
    fs.writeFileSync(FileReader.filePath, `${text}\n`, { flag: 'a+' });
  }
}
