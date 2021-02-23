export interface AuthenticateDTO {
  email: string;
  password: string;
}

export interface LoginDTO extends AuthenticateDTO {
  id: string;
}

export interface RegisterDTO extends AuthenticateDTO {
  username: string;
}

export interface GoogleDTO {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
}
