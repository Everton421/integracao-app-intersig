import { type ResultSetHeader } from "mysql2";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { SectorRequest } from "./sector-request.ts";
import { type setores } from "./contracts/setores.ts";
import { getSetores } from "./repository-setor.ts";

export class ServiceSendSector {
    static async send(codeSectorErp: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: any }

        try {
            const resultSetor = await getSetores(codeSectorErp) as setores[];

            if (resultSetor.length === 0) {
                resultfunction.success = false;
                resultfunction.message = `Setor codigo ${codeSectorErp} não foi encontrado(a)`
            } else {
                const { CODIGO, NOME, DATA_CADASTRO } = resultSetor[0];

                const resultRequest = await SectorRequest.post(
                    {
                        codigo: Number(CODIGO),
                        id: String(CODIGO),
                        descricao: String(NOME),
                        data_cadastro: String(DATA_CADASTRO),
                    }
                )

                if (resultRequest.success) {
                    if (resultRequest.data && resultRequest.data.codigo) {
                        const { codigo } = resultRequest.data;

                        const sqlInsert = `INSERT INTO ${MOBILE}.setores_enviados (id_mobile, codigo_sistema) VALUES (?, ?)`;
                        const values = [codigo, codeSectorErp];
                        const [{ insertId }] = await dbConn.query(sqlInsert, values) as ResultSetHeader[];
                        if (insertId > 0) {
                            resultfunction.success = true;
                        } else {
                            resultfunction.success = false;
                            resultfunction.message = `[X] Algo inesperado ocorreu ao tentar registrar setor[ERP] ${codeSectorErp} na tabela setores_enviados.`;
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
