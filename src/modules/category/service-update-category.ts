import { CategoryRequest } from "./category-request.ts";
import { type cad_pgru } from "./contracts/cad_pgru.ts";
import { getCategory } from "./repository-category.ts";

export class ServiceUpdateCategory {

    static async update(codeCategoryErp:number, idCategoryMobile:number){
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data:  any }
        try{
     const resultCadPgru = await getCategory(codeCategoryErp)   as cad_pgru[];

            if (resultCadPgru.length === 0) {
                    resultfunction.success = false;
                    resultfunction.message === `Categoria codigo ${codeCategoryErp} não foi encontrada `
            }else{
                const { CODIGO, NOME, DATA_CADASTRO , DATA_RECAD  } =resultCadPgru[0];

                 const resultResquest = await CategoryRequest.put( 
                        {   
                            descricao: String(NOME),
                            data_cadastro: DATA_CADASTRO,
                            data_recadastro: DATA_RECAD,
                            ativo: "S",
                            id: String(CODIGO)
                         },
                         Number(idCategoryMobile)
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
