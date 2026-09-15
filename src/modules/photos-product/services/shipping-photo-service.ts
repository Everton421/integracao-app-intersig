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
}