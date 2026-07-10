import { type ResultSetHeader } from "mysql2";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { BrandRequest } from "./brand-request.ts";
import { type cad_pmar } from "./contracts/cad_pmar.ts";
import { getBrand } from "./repository-brand.ts";

export class ServiceSendBrand {
    static async send(codebrandErp:number){
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data:  any }
        try{
     const resultCadPmar = await getBrand(codebrandErp)   as cad_pmar[];

            if (resultCadPmar.length === 0) {
                    resultfunction.success = false;
                    resultfunction.message === `Marca codigo ${codebrandErp} não foi encontrada `
            }else{
                const { CODIGO, DESCRICAO, DATA_CADASTRO , DATA_RECAD  } =resultCadPmar[0];

                 const resultResquest = await BrandRequest.post( 
                        {   
                            codigo: Number(CODIGO),
                            descricao: String(DESCRICAO),
                            data_cadastro: DATA_CADASTRO,
                            data_recadastro: DATA_RECAD,
                            ativo: "S",
                            id: String(CODIGO)
                         }
                    )

                    if(resultResquest.success){
                        if( resultResquest.data &&  resultResquest.data.codigo){
                            const { codigo } = resultResquest.data;

                            const sqlInsert =`INSERT INTO ${MOBILE}.marcas_enviadas ( id_mobile ,  codigo_sistema ) VALUES ( ? , ? )`;
                            const values = [ codigo , codebrandErp];
                            const [{ insertId }] = await dbConn.query(sqlInsert, values ) as ResultSetHeader[]; 
                            if( insertId > 0 ){
                                resultfunction.success = true;
                            }else{
                                resultfunction.success = false;
                                resultfunction.message = `[X] Algo de inesperado ocorreu ao tentar registrar marca[ERP] na tabela marca_enviadas ${codebrandErp}.`;
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