import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { type event } from "../../contracts/event.ts";
import { type table_enviados } from "../../contracts/table-enviados.ts";
import { purchaseOrderMapper } from "./purchaseOrder.ts";
import { DateService } from "../../utils/date.ts";
import { api } from "../../services/api.ts";


export async function serviceSendPurchaseOrder(event: event) {
        const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

        const [arrVerifyOrder] = await dbConn.query(`SELECT * FROM ${MOBILE}.pedidos_compra WHERE codigo_sistema = ${event.id_registro};`)
        const verifyOrder = arrVerifyOrder as table_enviados[];

        const obj = await purchaseOrderMapper(event.id_registro);
                  
        let resultFunction = { sucess: false , message:''};

        if (verifyOrder.length > 0) {
                if (obj !== undefined) {
                        try {

                                const result = await api.post("/pedidos", [obj], {
                                        headers: {
                                                source: origin
                                        }
                                }
                                )

                                    if (result.status === 200 || result.status === 201 ) {
                                        const resultId = result.data.results[0].codigo;

                                        const SQL = `INSERT INTO ${MOBILE}.pedidos_compra SET id_mobile = ? , codigo_sistema = ? ;`;
                                        const values = [resultId, event.id_registro]
                                        await dbConn.query(SQL, values)
                                              resultFunction.sucess = true;
                                }  
                        } catch (e) {
                                console.log(e)
                                        resultFunction.sucess = false;
                                        resultFunction.message = String(e);
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

                                     if (result.status === 200 || result.status === 201 ) {
                                        const resultId = result.data.results[0].codigo;

                                        const SQL = `INSERT INTO ${MOBILE}.pedidos_compra SET id_mobile = ? , codigo_sistema = ? ;`;
                                        const values = [resultId, event.id_registro]
                                        await dbConn.query(SQL, values)
                                              resultFunction.sucess = true;
                                }  
                        } catch (e) {
                                console.log(e)
                                        resultFunction.sucess = false;
                                        resultFunction.message = String(e);
                                
                        }
                }

                // enviar como novo 
        }
        return resultFunction

}