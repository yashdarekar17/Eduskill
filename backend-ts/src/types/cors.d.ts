declare module 'cors' {
  import { RequestHandler } from 'express';
  
  interface CorsOptions {
    origin?: string | string[] | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void);
    credentials?: boolean;
    methods?: string[];
    allowedHeaders?: string[];
    maxAge?: number;
  }
  
  function cors(options?: CorsOptions): RequestHandler;
  export = cors;
}
