import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { api } from "../../services/api.ts";
import { type MessageSeparationOrder } from "../sales-order/contracts/message-separation-order.ts";
import { pedidosRecebidos } from "../sales-order/contracts/pedidos-recebidos.ts";
import { PurchaseOrderRepository } from "./repository-purchase-order.ts";

 
 
export class UpdatePurchaseOrderSeparation {
    
   static async updateErpOrder (order: MessageSeparationOrder){
     let resultFunctionUpdateErpOrder = { success: false, message:null } as  { success: boolean , message: null | string }
            try{
                 if(order.pedido){
                    const resultRequestOrder = await api.get(`/pedidos/${order.pedido}`);
                      if(resultRequestOrder.status == 200 && resultRequestOrder.data  ){
                            const order  = resultRequestOrder.data;

                                if(order.tipo === 6 ){
                                
                                    const [rows] =  await dbConn.query(`SELECT * FROM ${MOBILE}.pedidos_compra WHERE id_mobile = ${order.codigo} `);
                                    const verify = rows as pedidosRecebidos[];
                                            
                                      if( verify.length > 0 ){
                                          const resultUpdateSeparationOrder = await PurchaseOrderRepository.updateSeparationPurchaseOrder(resultRequestOrder.data, verify[0].codigo_sistema )    
                                          if(resultUpdateSeparationOrder.sucess ){                                            
                                            resultFunctionUpdateErpOrder.success = true;
                                          }else{
                                            resultFunctionUpdateErpOrder.message = resultUpdateSeparationOrder.message || `[X] Algo de inesperado ocorreu ao tentar processar pedido de compra [MOBILE]  ${order.codigo}`;
                                          }
                                        }else{
                                           resultFunctionUpdateErpOrder.message =  `[x] Pedido de compra ${order.pedido} não foi registrado na tabela de pedidos do banco ${MOBILE}.`;
                                            console.log(resultFunctionUpdateErpOrder.message)
                                        }
                                }else{
                                   resultFunctionUpdateErpOrder.message =  `[x] Pedido [MOBILE] ${order.pedido} tipo: ${order.tipo} possui um tipo diferente do esperado.`;
                                    console.log(resultFunctionUpdateErpOrder.message)
                                }
                            
                        }else{
                               resultFunctionUpdateErpOrder.message =  `[x] A api não retornou o pedido de compra [MOBILE] ${order.pedido}  .`;
                                console.log(resultFunctionUpdateErpOrder.message)
                        }
                  
                    }else{
                        console.log(`[x] não foi encontrado pedido ${order.pedido} na tabela de pedidos enviados.`)
                    }

                }catch(e){
                    console.log(`[X] Ocorreu um erro ao tentar processar pedido ${order.pedido} `, e );
                }finally{
                   return resultFunctionUpdateErpOrder;
                }
            }

    }
