export class ResponseBase {
  code: number;
  message: string;
  data: any;

  constructor(code: number, message: string, data: any) {
    this.code = code;
    this.message = message;
    this.data = data;
  }
}

export enum ResponseCode {
  SUCCESS = 10000,
  ERROR = 99999,
}
