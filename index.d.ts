declare module "@guritso/terminal" {
  interface Terminal {
    verbose: number;
    readonly levels: {
      readonly info: string;
      readonly fail: string;
      readonly pass: string;
    };
    projectInfo: {
      name: string;
      version: string;
    };
    start(host?: string, port?: number): void;
    pass(message: unknown): void;
    log(message: unknown): void;
    setup(): boolean;
    clear(): boolean;
    setVerbose(verbose: number): void;
    isError(data: unknown): boolean;
  }

  const terminal: Terminal;
  export = terminal;
}
