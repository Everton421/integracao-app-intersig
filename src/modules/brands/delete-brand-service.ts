import { type ResultSetHeader } from "mysql2";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { BrandRequest } from "./brand-request.ts";
import type { table_enviados } from "../../contracts/table-enviados.ts";


/**
 * Executa a exclusao da marca na api e exclui o registro de sincronização no banco de dados de controle
 */
export class DeleteBrandService {

    /**
     * 
     * @param codebrandErp Codigo da marca no [ERP]
     * @returns 
     */
  static async delete(codebrandErp: number) {
    let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: any | null }

    try{

        const [resultVerifyBrands] = await dbConn.query(`SELECT * FROM ${MOBILE}.marcas_enviadas WHERE codigo_sistema = ${codebrandErp};`);
        const arrVerifyBrands = resultVerifyBrands as table_enviados[]
        const brandVerify = arrVerifyBrands[0];

        if (arrVerifyBrands.length > 0) {

            const resultDeletebrandRequest = await BrandRequest.delete(brandVerify.id_mobile);
            if (resultDeletebrandRequest.success) {
              const [ { affectedRows }] = await dbConn.query(`DELETE FROM ${MOBILE}.marcas_enviadas WHERE codigo_sistema = ${codebrandErp};`) as ResultSetHeader[];

                if(affectedRows > 0 ){
                  resultfunction.success = true;
                }else{
                  resultfunction.success = false;
                  resultfunction.message = `[X] Algo de inesperado ocorreu ao tentar excluir marca da tabela marcas_enviadas, codigo [ERP] ${codebrandErp}, codigo [MOBILE] ${brandVerify.id_mobile}`;
                }

            }else{
                resultfunction.success = resultDeletebrandRequest.success;
                resultfunction.message = resultDeletebrandRequest.message;
                resultfunction.data = resultDeletebrandRequest.data;
            }
        }else{
          resultfunction.success = false;
          resultfunction.message = `[X] Não foi encontrado registro de sincronização da marca codigo [ERP]: ${codebrandErp}`
        }
    }catch( e ){
          resultfunction.success = false;
          resultfunction.message = `[X] Algo de inesperado ocorreu ao tentar excluir marca codigo [ERP] ${codebrandErp}`;

    }finally{
        return resultfunction
    }

  }
}