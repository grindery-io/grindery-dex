export type JSONRPCRequestType = {
  jsonrpc: '2.0';
  id: string;
  method: string;
  params?: {
    [key: string]: any;
  };
  error?: {
    code: number;
    message: string;
    data: any;
  };
  result?: any;
};
