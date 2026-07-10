import { type event } from "../../contracts/event.ts";
import { type table_enviados } from "../../contracts/table-enviados.ts";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { DeleteCategoryService } from "./delete-category-service.ts";
import { ServiceSendCategory } from "./service-send-category.ts";
import { ServiceUpdateCategory } from "./service-update-category.ts";

export class ServiceSyncCategories {
        static async syncData(event: event) {
                let resultFunction = { success: false, message: null } as { success: boolean, message: string | null };

                try {

                        const [resultVerifySendedCategory] = await dbConn.query(`SELECT * FROM ${MOBILE}.categorias_enviadas WHERE codigo_sistema = '${event.id_registro}';`)
                        const arrVerifySendedCategory = resultVerifySendedCategory as table_enviados[]

                        if (event.tipo_evento === 'DELETE') {
                                const resultDeleteCategoryService = await DeleteCategoryService.delete(event.id_registro)
                                resultFunction.success = resultDeleteCategoryService.success
                                resultFunction.message = resultDeleteCategoryService.message
                        }

                        if (event.tipo_evento === 'UPDATE') {
                                if (arrVerifySendedCategory.length > 0) {
                                        const { id_mobile } = arrVerifySendedCategory[0];
                                        const resultUpdateCategory = await ServiceUpdateCategory.update(event.id_registro, id_mobile)
                                        resultFunction.success = resultUpdateCategory.success
                                        resultFunction.message = resultUpdateCategory.message

                                }
                        }

                        if (event.tipo_evento === 'INSERT') {
                                if (arrVerifySendedCategory.length > 0) {
                                        resultFunction.success = false
                                        resultFunction.message = `[X] categoria[ERP] ${event.id_registro} já foi enviada.`

                                } else {
                                        const resultServiceSendCategory = await ServiceSendCategory.send(event.id_registro);
                                        resultFunction.success = resultServiceSendCategory.success
                                        resultFunction.message = resultServiceSendCategory.message
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
