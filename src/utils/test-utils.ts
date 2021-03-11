import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { sign } from 'jsonwebtoken';
import { GoogleDTO, LoginDTO } from 'src/auth/auth.dto';
import { User } from '../types/user';

export async function testModuleWithInMemoryDb(moduleMetadata: ModuleMetadata) {
  const mongoServer = new MongoMemoryServer();
  const uri = await mongoServer.getUri();
  const module = await Test.createTestingModule({
    ...moduleMetadata,
    imports: [
      ...moduleMetadata.imports,
      MongooseModule.forRoot(uri, { useNewUrlParser: true, useUnifiedTopology: true }),
    ],
  }).compile();
  return {
    module,
    mongoServer,
  };
}

export function validJWTToken(payload: LoginDTO | GoogleDTO, expiresIn = 3600) {
  return sign(payload, 'test-secret', { expiresIn });
}

export const mockUserDoc = (mock?: Partial<User>): Partial<User> => {
  return {
    username: mock?.username || 'username',
    password: mock?.password || 'password',
    id: mock?.id || 'id',
    email: mock?.email || 'email@test.com',
    toObject() {
      const { password, toObject, ...result } = this;
      return result;
    },
  };
};
