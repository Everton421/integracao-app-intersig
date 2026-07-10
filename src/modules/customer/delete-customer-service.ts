import { type ResultSetHeader } from "mysql2";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { CustomerRequest } from "./customer-request.ts";
import type { table_enviados } from "../../contracts/table-enviados.ts";

export class DeleteCustomerService {

  static async delete(codeCustomerErp: number) {
    let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: any | null }

    try{

        const [resultVerifyCustomer] = await dbConn.query(`SELECT * FROM ${MOBILE}.clientes_enviados WHERE codigo_sistema = ${codeCustomerErp};`);
        const arrVerifyCustomer = resultVerifyCustomer as table_enviados[]
        const customerVerify = arrVerifyCustomer[0];

        if (arrVerifyCustomer.length > 0) {

            const resultDeleteCustomerRequest = await CustomerRequest.delete(customerVerify.id_mobile);
            if (resultDeleteCustomerRequest.success) {
              const [ { affectedRows }] = await dbConn.query(`DELETE FROM ${MOBILE}.clientes_enviados WHERE codigo_sistema = ${codeCustomerErp};`) as ResultSetHeader[];

                if(affectedRows > 0 ){
                  resultfunction.success = true;
                }else{
                  resultfunction.success = false;
                  resultfunction.message = `[X] Algo de inesperado ocorreu ao tentar excluir cliente da tabela clientes_enviados, codigo [ERP] ${codeCustomerErp}, codigo [MOBILE] ${customerVerify.id_mobile}`;
                }

            }else{
                resultfunction.success = resultDeleteCustomerRequest.success;
                resultfunction.message = resultDeleteCustomerRequest.message;
                resultfunction.data = resultDeleteCustomerRequest.data;
            }
        }else{
          resultfunction.success = false;
          resultfunction.message = `[X] Não foi encontrado registro de sincronização do cliente codigo [ERP]: ${codeCustomerErp}`
        }
    }catch( e ){
          resultfunction.success = false;
          resultfunction.message = `[X] Algo de inesperado ocorreu ao tentar excluir cliente codigo [ERP] ${codeCustomerErp}`;

    }finally{
        return resultfunction
    }

  }
}
