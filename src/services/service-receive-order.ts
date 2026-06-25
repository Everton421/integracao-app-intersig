import dbConn, { MOBILE } from "../database/connection/database-connection.ts";
import { type pedidosRecebidos } from "../contracts/pedidos-recebidos.ts";
import { insertPedido, updatePedido, updatePedidoSeparacao } from "../modules/sales-order/repository-pedido.ts";
import { api } from "../services/api.ts";
import { updatePedidoCompra } from "../modules/purchase-order/repository-pedido-compra.ts";

async function insertNewOrder(order:any){
    if(order.codigo){

           const [rows] =  await dbConn.query(`SELECT * FROM ${MOBILE}.pedidos WHERE id_mobile = ${order.codigo} `);
                    const verify = rows as pedidosRecebidos[];
                    if( verify.length > 0 ){
                        console.log(`O pedido já foi registrado anteriormente`)
                    }else{

                const resultRequestOrder = await api.get(`/pedidos/${order.codigo}`);
                        
                 if(resultRequestOrder.status == 200 && resultRequestOrder.data  ){
                    
                      const resultInsert = await insertPedido(resultRequestOrder.data );
//
                 if(resultInsert){
                     const resultInsertEvent = await dbConn.query(`INSERT INTO ${MOBILE}.pedidos SET id_mobile = ${order.codigo}, codigo_sistema=${resultInsert} `);
                 }
                }else{
                        console.log(`[X] Resulta da consulta vazio, codigo pedido: ${order.codigo}  `)
                }

            }
        }   

}


export async function updateOrder(order:any){
    if(order.codigo){

                const resultRequestOrder = await api.get(`/pedidos/${order.codigo}`);
                 if(resultRequestOrder.status == 200 && resultRequestOrder.data  ){
                        const order  = resultRequestOrder.data;

                            if(order.tipo === 6 ){
                                console.log("[V] Atualizando pedido de compra ...")
                                const [rows] =  await dbConn.query(`SELECT * FROM ${MOBILE}.pedidos_compra WHERE id_mobile = ${order.codigo} `);
                                const verify = rows as pedidosRecebidos[];
                                if( verify.length > 0 ){
                                   const result = await updatePedidoCompra(order, verify[0].codigo_sistema )  
                                }
                            }else{
                                const [rows] =  await dbConn.query(`SELECT * FROM ${MOBILE}.pedidos WHERE id_mobile = ${order.codigo} `);
                                const verify = rows as pedidosRecebidos[];
                                        
                            if( verify.length > 0 ){
                                     await updatePedidoSeparacao(resultRequestOrder.data, verify[0].codigo_sistema )    
                                   }
                              }
                        
                    }else{
                          console.log(`[x] A api não retornou o pedido ${order.codigo}  .`)

                 }

                  
               }else{
                console.log(`[x] não foi encontrado pedido ${order.codigo} na tabela de pedidos enviados.`)
               }

}

