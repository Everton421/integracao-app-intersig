import { type event } from "../../contracts/event.ts";
import { type table_enviados } from "../../contracts/table-enviados.ts";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { DeleteCustomerService } from "./delete-customer-service.ts";
import { ServiceSendCustomer } from "./service-send-customer.ts";
import { ServiceUpdateCustomer } from "./service-update-customer.ts";

export class ServiceSyncCustomers {
        static async syncData(event: event) {
                let resultFunction = { success: false, message: null } as { success: boolean, message: string | null };

                try {

                        const [resultVerifySendedCustomer] = await dbConn.query(`SELECT * FROM ${MOBILE}.clientes_enviados WHERE codigo_sistema = '${event.id_registro}';`)
                        const arrVerifySendedCustomer = resultVerifySendedCustomer as table_enviados[]

                        if (event.tipo_evento === 'DELETE') {
                                const resultDeleteCustomerService = await DeleteCustomerService.delete(event.id_registro)
                                resultFunction.success = resultDeleteCustomerService.success
                                resultFunction.message = resultDeleteCustomerService.message
                        }

                        if (event.tipo_evento === 'UPDATE' || event.tipo_evento === 'INSERT' ) {
                                if (arrVerifySendedCustomer.length > 0) {
                                        const { id_mobile } = arrVerifySendedCustomer[0];
                                        const resultUpdateCustomer = await ServiceUpdateCustomer.update(event.id_registro, id_mobile)
                                        resultFunction.success = resultUpdateCustomer.success
                                        resultFunction.message = resultUpdateCustomer.message
                                }else{
                                        console.log(`[X] Recebido evento ${event.tipo_evento} para tabela ${event.tabela_origem}, porem o registro ainda nao foi enviado.`)
                                         const resultServiceSendCustomer = await ServiceSendCustomer.send(event.id_registro);
                                        resultFunction.success = resultServiceSendCustomer.success
                                        resultFunction.message = resultServiceSendCustomer.message
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
