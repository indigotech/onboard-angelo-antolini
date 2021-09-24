export interface UserInput {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

export interface LonginInput {
  email: string;
  password: string;
}

export interface ListInput {
  quantity: number;
  page: number;
}
