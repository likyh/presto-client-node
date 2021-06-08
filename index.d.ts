declare module "presto-client-ts" {
  interface IPrestoClientOptions {
    host: string;
    ssl?: {
      ca?: string;
      cert: string;
      ciphers?: string;
      key?: string;
      passphrase?: string;
      secureProtocol: string;
      pfx?: string;
      rejectUnauthorized?: boolean;
    };
    port?: number;
    source?: string;
    user: string;
    catalog: string;
    checkInterval?: number;
    basic_auth?: {
      user: string;
      password: string;
    };
    schema?: string;
    enableVerboseStateCallback?: boolean;
  }

  enum PrestoClientQueryStates {
    QUEUED = "QUEUED",
    PLANNING = "PLANNING",
    STARTING = "STARTING",
    RUNNING = "RUNNING",
    FINISHED = "FINISHED",
    CANCELED = "CANCELED",
    FAILED = "FAILED"
  }

  interface IPrestoClientStats {
    processedBytes: number;
    processedRows: number;
    wallTimeMillis: number;
    cpuTimeMillis: number;
    userTimeMillis: number;
    state: PrestoClientQueryStates;
    scheduled: boolean;
    nodes: number;
    totalSplits: number;
    queuedSplits: number;
    runningSplits: number;
    completedSplits: number;
  }

  // NOTE: Needs to be extended with missing items
  enum PrestoClientPrestoTypes {
    varchar = "varchar",
    bigint = "bigint",
    boolean = "boolean",
    char = "char",
    date = "date",
    decimal = "decimal",
    double = "double"
  }

  interface IPrestoClientColumnMetaData {
    name: string;
    type: PrestoClientPrestoTypes;
  }

  type PrestoClientColumnDatum = [string, any];

  interface IPrestoClientExecuteOptions {
    query: string;
    catalog?: string;
    prepares?: string[];
    schema?: string;
    timezone?: string;
    info?: boolean;
    cancel?: () => boolean;
    state?: (error: any, query_id: string, stats: IPrestoClientStats) => void;
    columns?: (error: any, columns: IPrestoClientColumnMetaData[]) => void;
    data?: (
      error: any,
      data: PrestoClientColumnDatum[],
      columns: IPrestoClientColumnMetaData[],
      stats: IPrestoClientStats
    ) => void;
    success?: (error: any, stats: IPrestoClientStats) => void;
    error?: (error: any) => void;
  }

  class Client {
    constructor(options: IPrestoClientOptions);
    public execute(options: IPrestoClientExecuteOptions): void;
    public query(query_id: string, callback: (error: any, data?: any) => void): void;
    public kill(query_id: string, callback: (error: any) => void): void;
    public nodes(opts: null | undefined | {}, callback: (error: any, data: {}[]) => void): void;
  }
}
