import { type ResultSetHeader } from "mysql2";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { getCategory } from "./repository-category.ts";
import { type cad_pgru } from "./contracts/cad_pgru.ts";
import { CategoryRequest } from "./category-request.ts";

export class ServiceSendCategory {

    static async send( codeCategoryErp:number ){
    
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data:  any }
        try{
    
              const arrPgru =  await getCategory(codeCategoryErp) as cad_pgru[];
            

            if (arrPgru.length === 0) {
                    resultfunction.success = false;
                    resultfunction.message === `Categoria codigo ${codeCategoryErp} não foi encontrada `
            }else{
                const { CODIGO,  NOME ,DATA_CADASTRO , DATA_RECAD  } =arrPgru[0];

                 const resultResquest = await CategoryRequest.post( 
                        {   
                            codigo: Number(CODIGO),
                            descricao: String(NOME),
                            data_cadastro: DATA_CADASTRO,
                            data_recadastro: DATA_RECAD,
                            ativo: "S",
                            id: String(CODIGO)
                         }
                    )

                    if(resultResquest.success){
                        if( resultResquest.data &&  resultResquest.data.codigo){
                            const { codigo } = resultResquest.data;

                            const sqlInsert =`INSERT INTO ${MOBILE}.categorias_enviadas ( id_mobile ,  codigo_sistema ) VALUES ( ? , ? )`;
                            const values = [ codigo , codeCategoryErp];
                            const [{ insertId }] = await dbConn.query(sqlInsert, values ) as ResultSetHeader[]; 
                            if( insertId > 0 ){
                                resultfunction.success = true;
                            }else{
                                resultfunction.success = false;
                                resultfunction.message = `[X] Algo de inesperado ocorreu ao tentar registrar categoria[ERP] na tabela categorias_enviadas ${codeCategoryErp}.`;
                            }
                        }
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