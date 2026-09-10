import { ProductDataAcess } from "../data-acess/product-data-acess.ts";
import { MappingProductShipping } from "../mapping/mapping-product-shipping.ts";
import { ApiClient } from "../../../services/api-client.ts";
import { isAxiosError } from "axios";
import {type  dataProductCreated } from "../interfaces/data-product-created.ts";

export class ProductShippingService { 
    private mappingProductShipping:MappingProductShipping;
    private productDataAcess:ProductDataAcess;
    private PUBLICO :string;
    private MOBILE:string;
    private api: ApiClient;

    constructor ( mappingProductShipping:MappingProductShipping, productDataAcess:ProductDataAcess, PUBLICO:string, MOBILE:string, api:ApiClient){
            this.mappingProductShipping=mappingProductShipping;
            this.productDataAcess=productDataAcess;
            this.PUBLICO=PUBLICO;
            this.MOBILE =MOBILE; 
            this.api = api;
    }

    /**
     * 
     * @param erpCodeProduct codigo do produto no erp.
     */
    async shippingProduct( erpCodeProduct:number){
            let resultFunction = {success: true, message:'', data: null } as  {success: boolean, message: string, data: any };
     
        try{

          // busca o produto na tabela de enviados. 
        const resultIsShippedProduct  = await this.productDataAcess.searchShippedProducts(this.MOBILE, { codigo_sistema: erpCodeProduct});
          //determina se o produto ja foi enviado. 
        const isShipped = resultIsShippedProduct.length > 0;
       

            // dados do produto para enviar para o mobile 
        const [dataProductErp] = await this.productDataAcess.searchProductErp(this.PUBLICO, erpCodeProduct );

            // dados da configuracao do mapa para envio de produto 
        const [dataMappProduct] = await this.productDataAcess.searchMappProducts( this.MOBILE );

            // dados do produto mapeados para envio
        const payloadToSendProduct = await this.mappingProductShipping.mappingToShipping(dataProductErp,dataMappProduct )
        
        
            if(!isShipped){

                   const resultPostRequest = await this.api.post<dataProductCreated>('/produtos',payloadToSendProduct )
                    if(resultPostRequest.status == 200 || resultPostRequest.status == 201){
                      const resultInsertShippedProduct =await this.productDataAcess.InsertShippedProducts(this.MOBILE, erpCodeProduct,  resultPostRequest.data.codigo);

                       if(resultInsertShippedProduct.affectedRows > 0 ) {
                            resultFunction.success = true;
                            resultFunction.data = payloadToSendProduct;
                            resultFunction.message = `[V] Produto enviado com sucesso!`;
                        }
                    }
            }else{
                   const resultPostRequest = await this.api.put<dataProductCreated>('/produtos',payloadToSendProduct )
                    if(resultPostRequest.status == 200 || resultPostRequest.status == 201){
                            resultFunction.success = true;
                            resultFunction.data = payloadToSendProduct;
                            resultFunction.message = `[V] Produto atualizado com sucesso!`;
                    }
            }
    }catch(e){
               resultFunction.success = false;
               resultFunction.data = null;
                if(isAxiosError(e)){
                     resultFunction.message =  e.response?.data.message;

                }else{
                     resultFunction.message = `[X] Um ou mais erros ocorreram ao tentar processar o produto ${erpCodeProduct} ${e}`;
                }
                
    }finally{
        return resultFunction

    }   

        }
    
}