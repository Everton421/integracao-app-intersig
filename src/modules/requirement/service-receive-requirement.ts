import { type ResultSetHeader } from "mysql2";
import { type table_enviados } from "../../contracts/table-enviados.ts";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { type EventRequirement } from "./contracts/event-requirement.ts";
import { RequirementRepository } from "./repository-requirement.ts";

export class ReceiveRequirementService {

    static async receive(event: EventRequirement): Promise<{ success: boolean; message: string | null }> {
        let resultFunction = { success: false, message: null } as { success: boolean; message: string | null };

        try {
            const sqlVerify = `SELECT * FROM ${MOBILE}.requerimentos WHERE id_mobile = ?;`;
            const [resultVerify] = await dbConn.query(sqlVerify, [event.codigo]);
            const arrVerify = resultVerify as table_enviados[];

            if (arrVerify.length > 0) {
                console.log(`[V] Requerimento ${event.codigo} já registrado no sistema.`);
                resultFunction.success = true;
                resultFunction.message = `Requerimento ${event.codigo} já registrado no sistema.`;
                return resultFunction;
            }

            const codigoSistema = await RequirementRepository.insertRequirement(event);

            if (codigoSistema > 0) {
                const sqlInsertMobile = `INSERT INTO ${MOBILE}.requerimentos SET id_mobile = ?, codigo_sistema = ?;`;
                const [resultInsertMobile] = await dbConn.query(sqlInsertMobile, [event.codigo, codigoSistema]) as ResultSetHeader[];

                if (resultInsertMobile.insertId > 0) {
                    console.log(`[V] Requerimento ${event.codigo} registrado no sistema com código ${codigoSistema}.`);
                    resultFunction.success = true;
                } else {
                    resultFunction.message = `[X] Requerimento ${event.codigo} inserido no ERP mas falhou ao registrar na tabela de mapeamento.`;
                }
            } else {
                resultFunction.message = `[X] Falha ao inserir requerimento ${event.codigo} no ERP.`;
            }

        } catch (e) {
            console.log(`[X] Ocorreu um erro ao tentar processar requerimento ${event.codigo}`, e);
            resultFunction.message = `[X] Erro ao processar requerimento ${event.codigo}.`;
        } finally {
            return resultFunction;
        }
    }
}