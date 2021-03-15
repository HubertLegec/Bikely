import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export async function testModuleWithInMemoryDb(moduleMetadata: ModuleMetadata) {
  const mongoServer = new MongoMemoryServer();
  // const uri = await mongoServer.getConnectionString();
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
