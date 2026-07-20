import { isAxiosError } from "axios";
import { api } from "../../services/api.ts";
import { type payloadRequestRequirement } from "./contracts/requeriment.ts";

export class RequirementRequest{

    private origin = process.env.API_ORIGIN_NAME || 'erp_integration';

 
    async post(payload:payloadRequestRequirement){
            let responseRequestMobile = {success: false, message:'' , data: null } as {success: boolean, message: string , data: null | payloadRequestRequirement };

                try {
                    const resultPost = await api.post('/requirements', payload,
                {
                    headers: {
                        source: new RequirementRequest().origin
                    }
                }

                    );
                        if(resultPost.status === 200 || resultPost.status === 201  ){
                                 responseRequestMobile.success = true 
                                 responseRequestMobile.data = resultPost.data as payloadRequestRequirement; 
                                }               
        
                } catch (error) {
    
                            let responseAxiosMessageError = '';
                            responseRequestMobile.message =  responseAxiosMessageError || `(X) Erro ao tentar enviar o requerimento codigo [ ${payload.codigo}] . ` +  error;
                    console.log(error)
                                if( isAxiosError(error)){
                                    responseAxiosMessageError = error.response?.data?.message;
                                }
                             
                            }finally{
                        return responseRequestMobile; 
                }
    }

        async put(payload: Omit<payloadRequestRequirement, 'codigo'>, codigo:number ){
            let responseRequestMobile = {success: false, message:'' , data: null } as {success: boolean, message: string , data: null | payloadRequestRequirement };
                try {
                    const resultPost = await api.put(`/requirements/${codigo}`, payload, 
                           {
                    headers: {
                        source: new RequirementRequest().origin
                    }
                }
                    );
                    
                        if(resultPost.status === 200 || resultPost.status === 201  ){
                                 responseRequestMobile.success = true 
                                 responseRequestMobile.data = resultPost.data as payloadRequestRequirement ; 
                           }               
        
                } catch (error) {
    
                            let responseAxiosMessageError = '';
                            responseRequestMobile.message =  responseAxiosMessageError || `(X) Erro ao tentar atualiza o requerimento codigo [ ${codigo}] . ` +  error;

                                if( isAxiosError(error)){
                                    responseAxiosMessageError = error.response?.data?.message;
                                }
                             
                            }finally{
                        return responseRequestMobile; 
                }
    }

}
