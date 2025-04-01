import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

type DbType = 'mariadb' | 'mysql';

export const typeOrmConfig: DataSourceOptions = {
  type: (process.env.DB_DATABASE_TYPE || 'mysql') as DbType,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entities{.ts,.js}'],
  synchronize: false,
  migrationsTableName: 'migrations',
  migrations: [__dirname + '/migrations/*.ts'],
  logging: false,
};

const dataSource = new DataSource(typeOrmConfig);

export default dataSource;
