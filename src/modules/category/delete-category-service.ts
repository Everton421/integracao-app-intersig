import { type ResultSetHeader } from "mysql2";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { CategoryRequest } from "./category-request.ts";
import type { table_enviados } from "../../contracts/table-enviados.ts";

export class DeleteCategoryService {

  static async delete(codeCategoryErp: number) {
    let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: any | null }

    try{

        const [resultVerifyCategory] = await dbConn.query(`SELECT * FROM ${MOBILE}.categorias_enviadas WHERE codigo_sistema = ${codeCategoryErp};`);
        const arrVerifyCategory = resultVerifyCategory as table_enviados[]
        const categoryVerify = arrVerifyCategory[0];

        if (arrVerifyCategory.length > 0) {

            const resultDeleteCategoryRequest = await CategoryRequest.delete(categoryVerify.id_mobile);
            if (resultDeleteCategoryRequest.success) {
              const [ { affectedRows }] = await dbConn.query(`DELETE FROM ${MOBILE}.categorias_enviadas WHERE codigo_sistema = ${codeCategoryErp};`) as ResultSetHeader[];

                if(affectedRows > 0 ){
                  resultfunction.success = true;
                }else{
                  resultfunction.success = false;
                  resultfunction.message = `[X] Algo de inesperado ocorreu ao tentar excluir categoria da tabela categorias_enviadas, codigo [ERP] ${codeCategoryErp}, codigo [MOBILE] ${categoryVerify.id_mobile}`;
                }

            }else{
                resultfunction.success = resultDeleteCategoryRequest.success;
                resultfunction.message = resultDeleteCategoryRequest.message;
                resultfunction.data = resultDeleteCategoryRequest.data;
            }
        }else{
          resultfunction.success = false;
          resultfunction.message = `[X] Não foi encontrado registro de sincronização da categoria codigo [ERP]: ${codeCategoryErp}`
        }
    }catch( e ){
          resultfunction.success = false;
          resultfunction.message = `[X] Algo de inesperado ocorreu ao tentar excluir categoria codigo [ERP] ${codeCategoryErp}`;

    }finally{
        return resultfunction
    }

  }
}
