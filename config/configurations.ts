interface Config {
  port: number;
  jwtSecretKey: string;
  databasePg: PgConfig;
}
interface PgConfig {
  host: string;
  port: number;
  username: string;
  database: string;
  password: string;
}

export default (): Config => ({
  port: Number(process.env.PORT),
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  databasePg: {
    host: process.env.HOST_PG,
    port: Number(process.env.PORT_PG),
    username: process.env.USER_NAME_PG,
    database: process.env.DATABASE_PG,
    password: process.env.PASSWORD_PG,
  },
});
