import { ApiClient } from "../../../services/api-client.ts";
import { ProductDataAcess } from "../../products/data-acess/product-data-acess.ts";
import { ProductShippingService } from "../../products/services/product-shipping-service.ts";
import { ProdSectorDataAcess } from "../data-acess/prod-sector-data-acess.ts";
import { MappingProdSectorShipping } from "../mapping/mapping-prod-sector-shipping.ts";

export class ProdSectorShippingService{
    
    private prodSectorDataAcess: ProdSectorDataAcess;
    private productShippingService:ProductShippingService
    private productDataAcess : ProductDataAcess;
    private ESTOQUE:string;
    private MOBILE:string;
    private mappingProdSectorShipping:MappingProdSectorShipping;
    private api: ApiClient;
   


    constructor(prodSectorDataAcess: ProdSectorDataAcess, productShippingService:ProductShippingService, productDataAcess : ProductDataAcess, ESTOQUE:string,MOBILE:string, mappingProdSectorShipping:MappingProdSectorShipping , api:ApiClient){
        this.prodSectorDataAcess =prodSectorDataAcess;
         this.productShippingService = productShippingService;
         this.productDataAcess =productDataAcess;
         this.ESTOQUE = ESTOQUE;
         this.MOBILE=MOBILE;
         this.mappingProdSectorShipping =mappingProdSectorShipping;
         this.api=api;
        }

    async shippingProdSector(product:number, sector:number){
        let resultFunction = {success: true, message:'' , data: null } as { success: boolean, message:string , data: any};

        const  dataProdSectorErp   = await this.prodSectorDataAcess.findStockByProductAndSector( this.ESTOQUE , product, sector);
        
         if(dataProdSectorErp.length > 0 ){
                let isProductShipped = false;

                // verifica se o produto já foi enviado anteriormente.
                let resultverfyProductIsShipped = await this.productDataAcess.searchShippedProducts(this.MOBILE,{ codigo_sistema: product});
             
                isProductShipped = resultverfyProductIsShipped.length > 0;

                // tenta enviar caso o produto nao fora enviado.
                    if( !isProductShipped){
                        console.log(`[V] Produto ${product} ainda nao doi enviado, efetuando envio...`)
                        let resultPostProduct = await this.productShippingService.shippingProduct(product);
                        if(resultPostProduct.success) {
                            isProductShipped = true;
                            console.log(`[V] Produto ${product} enviado com sucesso.`)
                        }
                    }
                
                    if(isProductShipped){
                            // dados do produto no setor.
                            const dataProdSector =dataProdSectorErp[0];

                            // dados do produto no setor para enviar para api.
                            const payloadToShippingProdSector = this.mappingProdSectorShipping.mappingToShipping(dataProdSector);

                              const resultRequestProdSector=  await this.api.put("/produtos-setor", payloadToShippingProdSector )
                            if(resultRequestProdSector.status == 200 || resultRequestProdSector.status == 201){
                               resultFunction.success = true
                                resultFunction.message =`[V] produto ${product} atualizado no setor ${sector}.`  
                            }
                    }else{
                        resultFunction.success = false
                        resultFunction.message =`[X] não foi possivel fazer o envio do produto ${product}.`
                    }

        }else{
              resultFunction.success = false
              resultFunction.message =`[X] não foi encontrado produto ${product} no setor ${sector}.`
        }
        return resultFunction
    }
}