import { type event } from "../../../contracts/event.ts";
import { ApiClient } from "../../../services/api-client.ts";
import { DateService } from "../../../utils/date.ts";
import { PhotosProductDataAcess } from "../data-acess/photos-product-data-acess.ts";

export class ShippingPhoto{
     private api: ApiClient;
     private photosProductDataAcess:PhotosProductDataAcess;
     private PUBLICO :string;
     private dateService :DateService ;

    constructor(api: ApiClient, photosProductDataAcess :PhotosProductDataAcess, PUBLICO:string){
        this.api = api;
        this.photosProductDataAcess=photosProductDataAcess;
        this.PUBLICO=PUBLICO;
           this.dateService = new DateService()
    }
    
    async shippingPhotosByProduct(codeProductMobile:number ){
        try {
            
        const photosProduct = await this.photosProductDataAcess.getPhotosByProduct(this.PUBLICO, codeProductMobile);
            
                const photosPayload=[]
            for(const photo of photosProduct ){

                 if(photo.LINK){
                    photosPayload.push( { 
                            link:photo.LINK,
                            sequencia: photo.SEQ,
                            descricao:'',
                            foto:'',
                            data_cadastro: this.dateService.obterDataAtual(),
                            data_recadastro: this.dateService.obterDataHoraAtual(),
                    });
                 }
            }
            const payload = { 
                produto: codeProductMobile,
                fotos:photosPayload
            }

           const resultRequest = await this.api.post(`/fotos/produto`, payload);
            if(resultRequest.status == 201 || resultRequest.status == 200){
                
            }
            
          } catch (error) {

        }
    }

    async shippingPhotosEvent(event:event ){
        try {
                const {  id } = event
        const photosProduct = await this.photosProductDataAcess.getPhotosByid(this.PUBLICO, id);
            let resultFunction = { success: true, message: '', data:null } as {  success: boolean, message: string, data: any};

               const photosPayload=[]
                let product = 0;
            for(const photo of photosProduct ){
                product =photo.PRODUTO;

                 if(photo.LINK){
                    photosPayload.push( { 
                            link:photo.LINK,
                            sequencia: photo.SEQ,
                            descricao:'',
                            foto:'',
                            data_cadastro: this.dateService.obterDataAtual(),
                            data_recadastro: this.dateService.obterDataHoraAtual(),
                    });

                       const resultRequest = await this.api.post(`/fotos/produto`, {
                        produto: product,
                            fotos:photosPayload
                       });
                       if(resultRequest.status == 201 || resultRequest.status == 200){
                        resultFunction.success = true;
                         resultFunction.message = `Foto ID: ${id} `;
                          return  resultFunction
                       }
                 }else{
                    console.log(`[X] Foto ID:${id} não será enviada pois esta sem link.`)
                    resultFunction.success =false;
                    resultFunction.message =`[X] Foto ID:${id} não será enviada pois esta sem link.`;
                }
            }
           
            
          } catch (error) {

        }
    }
 
}