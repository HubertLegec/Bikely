import { Document } from 'mongoose';

export interface User extends Document {
  id: string;
  username: string;
  password: string;
  email: string;
  created: Date;
}

export function userTransformFunction(document: User, representation, options) {
  delete representation.password;
  representation.id = representation._id;
  delete representation._id;
  delete representation.__v;
}
