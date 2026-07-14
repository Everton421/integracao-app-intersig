import { type event } from "../../contracts/event.ts";
import { type table_enviados } from "../../contracts/table-enviados.ts";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { api } from "../../services/api.ts";
import { LogsRepository } from "../logs-integration/logs-repository.ts";
import { OrderMapper } from "./order-mapper.ts";
 

export class ServiceSyncSalesOrder {
        static async syncData ( event: event ){

                const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

                const [arrVerifyOrder] = await dbConn.query(`SELECT * FROM ${MOBILE}.pedidos WHERE codigo_sistema = ${event.id_registro};`)
                const verifyOrder = arrVerifyOrder as table_enviados[];

                const objOrderToSend =  await OrderMapper.mapping(event.id_registro);

                let resultFunction = { sucess: false, message: '' };

                if (verifyOrder.length > 0) {
                        if (objOrderToSend !== undefined) {
                                try {

                                        const result = await api.post("/pedidos", [objOrderToSend], {
                                                headers: {
                                                        source: origin
                                                }
                                        }
                                        )

                                        if (result.status === 200 || result.status === 201) {
                                                const resultId = result.data.results[0].codigo;
                                                resultFunction.sucess = true
                                        }
                                } catch (e:any) {
                                         await LogsRepository.registerLogs(
                                                 { 
                                                 json_payload: JSON.stringify(objOrderToSend), 
                                                  detalhes_erro: String(e.response),
                                                  id_message: event.id_message || '',
                                                  tabela_origem: event.tabela_origem,
                                                  status: 'erro',
                                                  id_registro: event.id_registro || 0,
                                                   tipo_evento: 'POST API '       
                                                 }
                                          )
                                        console.log(e)
                                        resultFunction.sucess = false;
                                        resultFunction.message = String(e);
                                }
                        }

                } else {

                        if (objOrderToSend !== undefined) {
                                try {

                                        const result = await api.post("/pedidos", [objOrderToSend],
                                                {
                                                        headers: {
                                                                source: origin
                                                        }
                                                }
                                        )
                                        if (result.status === 200 || result.status === 201) {
                                                const resultId = result.data.results[0].codigo;

                                                const SQL = `INSERT INTO ${MOBILE}.pedidos SET id_mobile = ? , codigo_sistema = ?  
                                                        ON DUPLICATE KEY UPDATE   id_mobile = ? , codigo_sistema = ?
                                                ;`;
                                                const values = [resultId, event.id_registro, resultId, event.id_registro ]
                                                await dbConn.query(SQL, values)
                                                resultFunction.sucess = true;
                                        }
                                } catch (e: any) {
                                            await LogsRepository.registerLogs(
                                                 { 
                                                 json_payload: JSON.stringify(objOrderToSend), 
                                                  detalhes_erro: String(e.response),
                                                  id_message: event.id_message || '',
                                                  tabela_origem: event.tabela_origem,
                                                  status: 'erro',
                                                  id_registro: event.id_registro || 0,
                                                   tipo_evento: 'POST API '       
                                                 }
                                                   )

                                        console.log(e.response)
                                        resultFunction.sucess = false;
                                        resultFunction.message = String(e);

                                }
                        }

                        // enviar como novo 
                }
                return resultFunction
        } 
}