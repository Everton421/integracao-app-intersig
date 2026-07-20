import {isAxiosError, type AxiosResponse } from "axios"
import { api } from "../../services/api.ts"

type  typeProductMobileRequest = {
        codigo: number
        preco: number
        estoque: number
        unidade_medida: string
        descricao: string
        num_fabricante: string   
        num_original: string   
        sku: string
        grupo: number
        marca: number
        ativo: "S" | "N"
        tipo: number
        class_fiscal: string
        origem: string
        controle_lote_serie: 'S' | 'N'
        data_cadastro?: string 
        observacoes1: string
        observacoes2: string
        observacoes3: string
}

type typePostProductMobile = typeProductMobileRequest & { id: number }  


export  function requestMobileProduct   () {
    const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

       const postProductMobile = async (data:  typePostProductMobile )=>{   
            let responseRequestMobile = {success: false, message:'' , data: null };
            try {
                const resultPost = await api.post('/produto', data, 
                           {
                    headers: {
                        source: origin
                        }
                    }

                );
                    if(resultPost.status === 200 || resultPost.status === 201  ){
                             responseRequestMobile.success = true 
                             responseRequestMobile.data = resultPost.data; 
                            }               
    
            } catch (error) {

                        let responseAxiosMessageError = '';
                            if( isAxiosError(error)){
                                responseAxiosMessageError = error.response?.data?.message;
                            }
                        responseRequestMobile.message =  responseAxiosMessageError || `(X) Erro ao tentar enviar o produto codigo [ ${data.id}] . ` +  error;
                         
                        }finally{
                    return responseRequestMobile; 
            }
    }
    
     const putProductMobile = async ( data:typePostProductMobile) =>{
            let responseRequestMobile = {success: false, data: null, message:'' };
    
            try {
                      const resultPutRequest = await api.put('/produto', data, 
                             {
                                headers: {
                                        source: origin
                                        }
                                }
                      );
                    if(resultPutRequest.status === 200 || resultPutRequest.status === 201  ){
                             responseRequestMobile.success = true;
                             responseRequestMobile.data = resultPutRequest.data;
                    }
            } catch (error ) {
                        let responseAxiosMessageError ='';
                        if( isAxiosError(error)){
                                  responseAxiosMessageError = error.response?.data?.message;
                        }        
                 const messageErrorRequest = responseAxiosMessageError || `(X) Erro ao tentar atualizar o produto codigo [ ${data.codigo}] id mobile [ ${data.id}].` +  error;
                 responseRequestMobile.message =  messageErrorRequest;
                }finally{
                    return responseRequestMobile; 
            }
            
    }
    
    
    const  deleteProductMobile = async ( codigo:number) =>{
            let responseRequestMobile = {success: false, message:'' };
    
            try {
                      const resultPost = await api.delete(`/produto:/${codigo}` );
                    if(resultPost.status === 200  ){
                             responseRequestMobile.success = true 
                    }
            } catch (error) {
                let responseAxiosMessageError ='';   
                if( isAxiosError(error)){
                        responseAxiosMessageError = error.response?.data?.message ||    `(X) Erro ao tentar excluir o produto codigo [ ${codigo}] .` +  error;
                }
                        responseRequestMobile.message = responseAxiosMessageError; 
            }finally{   
                    return responseRequestMobile; 
    
            }
            
    }

    return { deleteProductMobile, putProductMobile , postProductMobile }
}