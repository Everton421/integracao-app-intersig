import { type ResultSetHeader } from "mysql2";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { ServiceTypeRequest } from "./service-type-request.ts";
import { type tipos_os } from "./contracts/tipos_os.ts";
import { getServiceType } from "./repository-service-type.ts";

export class ServiceSendServiceType {
    static async send(codeServiceTypeErp: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: any }

        try {
            const resultServiceType = await getServiceType(codeServiceTypeErp) as tipos_os[];

            if (resultServiceType.length === 0) {
                resultfunction.success = false;
                resultfunction.message = `Tipo de OS codigo ${codeServiceTypeErp} não foi encontrado(a)`
            } else {
                const { CODIGO, DESCRICAO, updated_at } = resultServiceType[0];

                const resultRequest = await ServiceTypeRequest.post(
                    {
                        codigo: Number(CODIGO),
                        id: Number(CODIGO),
                        descricao: String(DESCRICAO),
                        data_cadastro: String(updated_at),
                        data_recadastro: String(updated_at),
                    }
                )

                if (resultRequest.success) {
                    if (resultRequest.data && resultRequest.data.codigo) {
                        const { codigo } = resultRequest.data;

                        const sqlInsert = `INSERT INTO ${MOBILE}.tiposos_enviadas (id_mobile, codigo_sistema) VALUES (?, ?)`;
                        const values = [codigo, codeServiceTypeErp];
                        const [{ insertId }] = await dbConn.query(sqlInsert, values) as ResultSetHeader[];
                        if (insertId > 0) {
                            resultfunction.success = true;
                        } else {
                            resultfunction.success = false;
                            resultfunction.message = `[X] Algo inesperado ocorreu ao tentar registrar tipo de os[ERP] ${codeServiceTypeErp} na tabela tiposos_enviadas.`;
                        }
                    }
                } else {
                    resultfunction.data = resultRequest.data;
                    resultfunction.success = resultRequest.success;
                    resultfunction.message = resultRequest.message;
                }
            }

        } catch (e) {
            resultfunction.success = false;
            resultfunction.message = String(e);
        } finally {
            return resultfunction;
        }

    }
}
