import { type pedidosRecebidos } from "./contracts/pedidos-recebidos.ts";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { api } from "../../services/api.ts";
import { type MessageSeparationOrder } from "./contracts/message-separation-order.ts";
import { SalesOrderRepository } from "./repository-pedido.ts";

 
export class UpdateSalesOrderSeparation {
    
   static async updateErpOrder (order:MessageSeparationOrder){
     let resultFunctionUpdateErpOrder = { success: false, message:null } as  { success: boolean , message: null | string }
            try{
                 if(order.pedido){
                    const resultRequestOrder = await api.get(`/pedidos/${order.pedido}`);
                      if(resultRequestOrder.status == 200 && resultRequestOrder.data  ){
                            const order  = resultRequestOrder.data;

                                if(order.tipo === 1 ){
                                
                                    const [rows] =  await dbConn.query(`SELECT * FROM ${MOBILE}.pedidos WHERE id_mobile = '${order.codigo}' `);
                                    const verify = rows as pedidosRecebidos[];
                                            
                                      if( verify.length > 0 ){
                                          const resultUpdateSeparationOrder = await SalesOrderRepository.updateSeparationOrder(resultRequestOrder.data, verify[0].codigo_sistema )    
                                          if(resultUpdateSeparationOrder.success ){                                            
                                            resultFunctionUpdateErpOrder.success = true;
                                          }else{
                                            resultFunctionUpdateErpOrder.message = resultUpdateSeparationOrder.message || `[X] Algo de inesperado ocorreu ao tentar processar pedido ${order.codigo}`;
                                          }
                                        }else{
                                           resultFunctionUpdateErpOrder.message =  `[x] Pedido ${order.pedido} não foi registrado na tabela de pedidos do banco ${MOBILE}.`;
                                            console.log(resultFunctionUpdateErpOrder.message)
                                        }
                                }else{
                                   resultFunctionUpdateErpOrder.message =  `[x] Pedido ${order.pedido} tipo: ${order.tipo} possui um tipo diferente do esperado.`;
                                    console.log(resultFunctionUpdateErpOrder.message)
                                }
                            
                        }else{
                               resultFunctionUpdateErpOrder.message =  `[x] A api não retornou o pedido ${order.pedido}  .`;
                                console.log(resultFunctionUpdateErpOrder.message)
                        }
                  
                    }else{
                        console.log(`[x] Valor do codigo do pedido invalido, valor informado ${order.pedido}.`)
                    }

                }catch(e){
                    console.log(`[X] Ocorreu um erro ao tentar processar pedido ${order.pedido} `, e );
                }finally{
                   return resultFunctionUpdateErpOrder;
                }
            }

    }
