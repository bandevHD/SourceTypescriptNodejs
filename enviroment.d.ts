declare namespace NodeJS {
  export interface ProcessEnv {
    MYSQL_DB_HOST?: string;
    MYSQL_DB_NAME?: string;
    MYSQL_DB_PORT?: string;
    MYSQL_DB_PASSWORD?: string;
    MYSQL_DB_USERNAME?: string;

    POSTGRES_DB_HOST?: string;
    POSTGRES_DB_NAME?: string;
    POSTGRES_DB_PORT?: string;
    POSTGRES_DB_PASSWORD?: string;
    POSTGRES_DB_USERNAME?: string;

    MONGGODB_URI?: string;
    JWT_KEY_ACCESS_TOKEN:string
  }
}
