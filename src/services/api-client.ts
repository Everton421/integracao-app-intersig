import axios, { type AxiosInstance,type  AxiosRequestConfig,type AxiosResponse } from "axios";

export class ApiClient{
    
    private  client: AxiosInstance;
    private maxRetries:number = 3;
    private baseDelayMs = 500;
  private baseURL = process.env.API_URL
  private token = process.env.API_TOKEN

    constructor(){
        this.client = axios.create({
            baseURL:this.baseURL, timeout:10000, 
            headers:{
                'Content-Type':'application/json',
                   source:'erp_integration',
                 token: this.token 
            }

        })
    }

    public async get<T>(url:string , config?: AxiosRequestConfig):Promise<AxiosResponse<T>>{
        return this.requestWithRetry<T>({...config, url, method:'GET' });
    }

    public async post<T>(url:string, data?:unknown, config?:AxiosRequestConfig ):Promise<AxiosResponse<T>>{
    //   return await this.client.post<T>(url,data, config) ;
        return this.requestWithRetry<T>({...config, url, method:'POST', data });

    }   
      public async put<T>(url:string, data?:unknown, config?:AxiosRequestConfig ):Promise<AxiosResponse<T>>{
        return this.requestWithRetry<T>({...config, url, method:'PUT',data});
    }  

    public async patch<T>(url:string, data?:unknown, config?:AxiosRequestConfig ):Promise<AxiosResponse<T>>{
            return this.requestWithRetry<T>({...config, url, method:'PATCH' ,data});
    }   
    

    private async requestWithRetry<T>(config:AxiosRequestConfig, retries:number = this.maxRetries):Promise<AxiosResponse<T>> {
        try {
            return await this.client.request<T>(config);
        } catch (error: any ) {
            const status= error.response.status;
            const isRetryable = status === 429 || status === 503 || error.code == 'ECONNABORTED';
        if(!isRetryable || retries <= 0 ) throw error;

            const retryAfter = Number(error?.response?.headers?.['retry-after']);
            const delayMs = retryAfter ? retryAfter * 1000 
            : this.baseDelayMs * Math.pow(2, this.maxRetries - retries ) + Math.random() * 100;
            
            await new Promise(res => setTimeout(res, delayMs));
            return this.requestWithRetry(config, retries - 1); 
        }
    }
 
}


  function sleep(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms));}