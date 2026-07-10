import { type event } from "../../contracts/event.ts";
import { type table_enviados } from "../../contracts/table-enviados.ts";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { ServiceSendServiceType } from "./service-send-service-type.ts";
import { ServiceUpdateServiceType } from "./service-update-service-type.ts";

export class ServiceSyncServiceType {
    static async syncData(event: event) {
        let resultFunction = { success: false, message: null } as { success: boolean, message: string | null };

        try {

            const [resultVerifySended] = await dbConn.query(`SELECT * FROM ${MOBILE}.tiposos_enviadas WHERE codigo_sistema = '${event.id_registro}';`)
            const arrVerifySended = resultVerifySended as table_enviados[]

            if (event.tipo_evento === 'UPDATE') {
                if (arrVerifySended.length > 0) {
                    const { id_mobile } = arrVerifySended[0];
                    const resultUpdate = await ServiceUpdateServiceType.update(event.id_registro, id_mobile)
                    resultFunction.success = resultUpdate.success
                    resultFunction.message = resultUpdate.message
                }
            }

            if (event.tipo_evento === 'INSERT') {
                if (arrVerifySended.length > 0) {
                    resultFunction.success = false
                    resultFunction.message = `[X] tipo de os[ERP] ${event.id_registro} já foi enviado(a).`
                } else {
                    const resultServiceSend = await ServiceSendServiceType.send(event.id_registro);
                    resultFunction.success = resultServiceSend.success
                    resultFunction.message = resultServiceSend.message
                }
            }

            if (event.tipo_evento === 'DELETE') {
                resultFunction.success = true
                resultFunction.message = `[X] DELETE ignorado para tipo de os[ERP] ${event.id_registro}.`
            }

        } catch (e) {
            resultFunction.success = false;
            resultFunction.message = String(e);
        } finally {
            return resultFunction
        }

    }
}
