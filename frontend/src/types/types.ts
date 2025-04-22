export interface MessageTypes {
    userId: string,
    message: string | { file:string, text: string },
    timeStamp: string,
  }