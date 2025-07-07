export interface ILogin {
    email: string,
    password: string
}

export interface IRegister {
    username: string,
    email: string,
    password: string
}

export interface User {
  id: string;
  email: string;
  password: string;
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    role: string
}