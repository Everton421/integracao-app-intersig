import { type event } from "../../contracts/event.ts";
import { type table_enviados } from "../../contracts/table-enviados.ts";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { ServiceSendSector } from "./service-send-sector.ts";
import { ServiceUpdateSector } from "./service-update-sector.ts";

export class ServiceSyncSector {
    static async syncData(event: event) {
        let resultFunction = { success: false, message: null } as { success: boolean, message: string | null };

        try {

            const [resultVerifySended] = await dbConn.query(`SELECT * FROM ${MOBILE}.setores_enviados WHERE codigo_sistema = '${event.id_registro}';`)
            const arrVerifySended = resultVerifySended as table_enviados[]

            if (event.tipo_evento === 'UPDATE') {
                if (arrVerifySended.length > 0) {
                    const { id_mobile } = arrVerifySended[0];
                    const resultUpdate = await ServiceUpdateSector.update(event.id_registro, id_mobile)
                    resultFunction.success = resultUpdate.success
                    resultFunction.message = resultUpdate.message
                }
            }

            if (event.tipo_evento === 'INSERT') {
                if (arrVerifySended.length > 0) {
                    resultFunction.success = false
                    resultFunction.message = `[X] setor[ERP] ${event.id_registro} já foi enviado(a).`
                } else {
                    const resultServiceSend = await ServiceSendSector.send(event.id_registro);
                    resultFunction.success = resultServiceSend.success
                    resultFunction.message = resultServiceSend.message
                }
            }

            if (event.tipo_evento === 'DELETE') {
                resultFunction.success = true
                resultFunction.message = `[X] DELETE ignorado para setor[ERP] ${event.id_registro}.`
            }

        } catch (e) {
            resultFunction.success = false;
            resultFunction.message = String(e);
        } finally {
            return resultFunction
        }

    }
}
