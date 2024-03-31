export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface ILogin {
  email: string;
  password: string;
}

// export interface ILoginResponse {
//   message: string;
//   token: string;
//   user: IUser;
// }

export interface ILoginResponse {
  access_token: string;
  refresh_token: string;
}
