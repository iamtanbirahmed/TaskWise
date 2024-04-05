export interface ILocals {
  userId: string;
  username: string;
}

export interface IResponse<T> {
  data: T;
  message?: string;
}
