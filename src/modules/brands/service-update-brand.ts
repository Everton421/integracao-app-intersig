import { BrandRequest } from "./brand-request.ts";
import { type cad_pmar } from "./contracts/cad_pmar.ts";
import { getBrand } from "./repository-brand.ts";

export class ServiceUpdateBrand {

    static async update(codebrandErp:number, idBrandMobile:number){
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data:  any }
        try{
     const resultCadPmar = await getBrand(codebrandErp)   as cad_pmar[];

            if (resultCadPmar.length === 0) {
                    resultfunction.success = false;
                    resultfunction.message === `Marca codigo ${codebrandErp} não foi encontrada `
            }else{
                const { CODIGO, DESCRICAO, DATA_CADASTRO , DATA_RECAD  } =resultCadPmar[0];

                 const resultResquest = await BrandRequest.put( 
                        {   
                            descricao: String(DESCRICAO),
                            data_cadastro: DATA_CADASTRO,
                            data_recadastro: DATA_RECAD,
                            ativo: "S",
                            id: String(CODIGO)
                         },
                         Number(idBrandMobile)
                    )

                    if(resultResquest.success){
                                resultfunction.success = true;
                    }else{
                        resultfunction.data = resultResquest.data;
                        resultfunction.success = resultResquest.success;
                        resultfunction.message = resultResquest.message;
                    }
            }

        }catch(e){
                resultfunction.success = false;
                resultfunction.message = String(e);
        }finally{
            return resultfunction;
        }
      
    } 
}