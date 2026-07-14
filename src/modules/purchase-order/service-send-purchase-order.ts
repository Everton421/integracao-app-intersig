import { type event } from "../../contracts/event.ts";
import { type table_enviados } from "../../contracts/table-enviados.ts";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { api } from "../../services/api.ts";
import { PurchaseOrderMapper } from "./purchase-order-mapper.ts";
import { LogsRepository } from "../logs-integration/logs-repository.ts";


 

export class ServiceSendPurchaseOrder{
    
        static async send(event: event){

                     const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

        const [arrVerifyOrder] = await dbConn.query(`SELECT * FROM ${MOBILE}.pedidos_compra WHERE codigo_sistema = ${event.id_registro};`)
        const verifyOrder = arrVerifyOrder as table_enviados[];

        const obj = await PurchaseOrderMapper.mapping(event.id_registro);

        let resultFunction = { success: false, message: '' };

        if (verifyOrder.length > 0) {
                console.log(`[V] Pedido de compra [ERP] ${event.id_registro} já foi enviado, atualizando pedido...`)
                if (obj !== undefined) {
                        try {

                                const result = await api.post("/pedidos", [obj], {
                                        headers: {
                                                source: origin
                                        }
                                }
                                )

                                if (result.status === 200 || result.status === 201) {
                                       resultFunction.success = true;
                                   resultFunction.message = `[V] Pedido de compra [ERP]: ${event.id_registro} atualizado com successo `;

                                }
                        } catch (e) {
                                console.log(e)
                                resultFunction.success = false;
                                resultFunction.message = String(e);
                                await LogsRepository.registerLogs({
                                        status: 'erro',
                                        json_payload: JSON.stringify(obj),
                                        detalhes_erro: String(e),
                                        id_registro: event.id_registro || 0,
                                        tabela_origem: 'cad_comp',
                                        tipo_evento: 'POST API UPDATE'
                                })
                        }
                }

        } else {

                if (obj !== undefined) {
                        try {

                                const result = await api.post("/pedidos", [obj],
                                        {
                                                headers: {
                                                        source: origin
                                                }
                                        }
                                )

                                if (result.status === 200 || result.status === 201) {
                                        const resultId = result.data.results[0].codigo;

                                        const SQL = `INSERT INTO ${MOBILE}.pedidos_compra SET id_mobile = ? , codigo_sistema = ? ;`;
                                        const values = [resultId, event.id_registro]
                                        await dbConn.query(SQL, values)
                                        resultFunction.success = true;
                                }
                        } catch (e) {
                                console.log(e)
                                resultFunction.success = false;
                                resultFunction.message = String(e);
                                await LogsRepository.registerLogs({
                                        status: 'erro',
                                        json_payload: JSON.stringify(obj),
                                        detalhes_erro: String(e),
                                        id_registro: event.id_registro || 0,
                                        tabela_origem: 'cad_comp',
                                        tipo_evento: 'POST API INSERT'
                                })

                        }
                }

                // enviar como novo 
        }
        return resultFunction

        }
}