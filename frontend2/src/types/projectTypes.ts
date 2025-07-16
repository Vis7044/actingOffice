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

export interface IAddress {
  building: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
}

export interface Client {
  businessName: string;
  type: string;
  address: IAddress;
}

interface IService {
    serviceName : string;
    description : string;
    amount: number
}

export interface IQuote {
    key: number;
    id: string;

    businessIdName : {
      id: string,
      name: string
    }
    quoteNumber: string;    
    date: string;
    firstResponse: {
      id:string,
      firstName: string,
      lastName: string
    }
    services: IService[]
    totalAmount: number;
    quoteStatus: string
}