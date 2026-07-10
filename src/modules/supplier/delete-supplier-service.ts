import { type ResultSetHeader } from "mysql2";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { SupplierRequest } from "./supplier-request.ts";
import type { table_enviados } from "../../contracts/table-enviados.ts";

export class DeleteSupplierService {

    static async delete(codeSupplierErp: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: any | null }

        try {

            const [resultVerifySupplier] = await dbConn.query(`SELECT * FROM ${MOBILE}.fornecedores_enviados WHERE codigo_sistema = ${codeSupplierErp};`);
            const arrVerifySupplier = resultVerifySupplier as table_enviados[]
            const supplierVerify = arrVerifySupplier[0];

            if (arrVerifySupplier.length > 0) {

                const resultDeleteSupplierRequest = await SupplierRequest.delete(supplierVerify.id_mobile);
                if (resultDeleteSupplierRequest.success) {
                    const [{ affectedRows }] = await dbConn.query(`DELETE FROM ${MOBILE}.fornecedores_enviados WHERE codigo_sistema = ${codeSupplierErp};`) as ResultSetHeader[];

                    if (affectedRows > 0) {
                        resultfunction.success = true;
                    } else {
                        resultfunction.success = false;
                        resultfunction.message = `[X] Algo de inesperado ocorreu ao tentar excluir fornecedor da tabela fornecedores_enviados, codigo [ERP] ${codeSupplierErp}, codigo [MOBILE] ${supplierVerify.id_mobile}`;
                    }

                } else {
                    resultfunction.success = resultDeleteSupplierRequest.success;
                    resultfunction.message = resultDeleteSupplierRequest.message;
                    resultfunction.data = resultDeleteSupplierRequest.data;
                }
            } else {
                resultfunction.success = false;
                resultfunction.message = `[X] Não foi encontrado registro de sincronização do fornecedor codigo [ERP]: ${codeSupplierErp}`
            }
        } catch (e) {
            resultfunction.success = false;
            resultfunction.message = `[X] Algo de inesperado ocorreu ao tentar excluir fornecedor codigo [ERP] ${codeSupplierErp}`;

        } finally {
            return resultfunction
        }

    }
}
