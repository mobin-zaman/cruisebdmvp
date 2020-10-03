import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {ConfigService} from '@nestjs/config';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'satao.db.elephantsql.com',
  port: 5432,
  username: 'bvlthtlu',
  password: 'SVKYfChY7T9Ip_H-_qaC3mE1i4goPamP',
  database: 'bvlthtlu',
  entities: [__dirname + "/../**/*.entity{.ts,.js}"], //this line works fine now
  synchronize: true,
  //TODO: enable ssl in the server
  ssl: false
}