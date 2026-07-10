import { type event } from "../../contracts/event.ts";
import { type table_enviados } from "../../contracts/table-enviados.ts";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { DeleteBrandService } from "./delete-brand-service.ts";
import { ServiceSendBrand } from "./service-send-brand.ts";
import { ServiceUpdateBrand } from "./service-update-brand.ts";



export class ServiceSyncbrand {
        static async syncData(event: event) {
                let resultFunction = { success: false, message: null } as { success: boolean, message: string | null };

                try {

                        const [resultVerifySendedBrand] = await dbConn.query(`SELECT * FROM ${MOBILE}.marcas_enviadas WHERE codigo_sistema = '${event.id_registro}';`)
                        const arrVerifySendedBrand = resultVerifySendedBrand as table_enviados[]

                        if (event.tipo_evento === 'DELETE') {
                                const resultDeleteBrandService = await DeleteBrandService.delete(event.id_registro)
                                resultFunction.success = resultDeleteBrandService.success
                                resultFunction.message = resultDeleteBrandService.message
                        }

                        if (event.tipo_evento === 'UPDATE') {
                                if (arrVerifySendedBrand.length > 0) {
                                        const { id_mobile } = arrVerifySendedBrand[0];
                                        const resultUpdateBrand = await ServiceUpdateBrand.update(event.id_registro, id_mobile)
                                        resultFunction.success = resultUpdateBrand.success
                                        resultFunction.message = resultUpdateBrand.message

                                }
                        }

                        if (event.tipo_evento === 'INSERT') {
                                if (arrVerifySendedBrand.length > 0) {
                                        resultFunction.success = false
                                        resultFunction.message = `[X] marca[ERP] ${event.id_registro} já foi enviada.`

                                } else {
                                        const resultServiceSendBrand = await ServiceSendBrand.send(event.id_registro);
                                        resultFunction.success = resultServiceSendBrand.success
                                        resultFunction.message = resultServiceSendBrand.message
                                }

                        }
                } catch (e) {
                        resultFunction.success = false;
                        resultFunction.message = String(e);
                } finally {
                        return resultFunction
                }

        }
}