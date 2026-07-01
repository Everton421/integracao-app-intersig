import { selectParcelasDoPedido, selectProdutoDoPedido, selectSeriesPedidoVenda } from "./repository-itens-pedido.ts";
import { selectClientePedido, selectPedidoSistema } from "./repository-pedido.ts";
import { serviceSendClient } from "../customer/service-send-client.ts";
import { DateService } from "../../utils/date.ts";

export async function orderMapper(codigo_sistema:number) {

            const dateService = new DateService();

            const result_erp_order= await selectPedidoSistema(codigo_sistema);
        
            if(result_erp_order.length > 0 ){
                const erp_order =   result_erp_order[0];
                const arr_produtos = await selectProdutoDoPedido(codigo_sistema);
                
                let arrClient  = await selectClientePedido(erp_order.CLIENTE);
                

                if(arrClient.length === 0 ){
                    console.log(`[X] Não foi encontrado  cliente do pedido codigo: ${codigo_sistema} no sistema.`)
                      await serviceSendClient({ id_registro: erp_order.CLIENTE, criado_em:'', dados_json:'', id:0, id_evento:0, id_message:'', setor:0, status:'PENDENTE', tabela:0, tabela_origem:'cad_clie', tipo_evento:'UPDATE'})
                }

                   arrClient  = await selectClientePedido(erp_order.CLIENTE);


                    const prod:any=[]
                    if(arr_produtos.length >  0 ){
                        for( const i of arr_produtos ) {
                            const series = []
                             const resultSeries = await selectSeriesPedidoVenda(codigo_sistema);
                                for(const serie of resultSeries){
                                    series.push({
                                         lote_serie : Number(serie.CODIGO),
                                         quantidade : String(serie.QTDE_SEPARADA),
                                         serie : String(serie.SERIE),
                                         lote : null
                                    })
                                } 

                            prod.push(
                                                {
                                                     pedido : codigo_sistema,
                                                     sequencia: i.SEQUENCIA,
                                                     codigo : i.id,
                                                     desconto : i.DESCONTO,
                                                     quantidade : i.QUANTIDADE,
                                                     preco : i.PRECO_TABELA,
                                                     total : i.TOTAL_LIQ,
                                                     quantidade_faturada : i.QTDE_FATURADA,
                                                     quantidade_separada : i.QTDE_SEPARADA,
                                                      controle_lote_serie: i.controle_lote_serie,
                                                      series:series
                                                }
                            )
                        }
                    }else{
                    console.log(`[X]o: ${codigo_sistema} no sistema.`)
                        return;
                    }

                    const arr_parcelas = await selectParcelasDoPedido(codigo_sistema);

                    const parcelas :any[] =[]
                        for( const i of arr_parcelas ){
                            parcelas.push( {
                                                     pedido : codigo_sistema,
                                                     parcela : i.PARCELA,
                                                     valor : i.VALOR,
                                                     vencimento : i.VENCIMENTO
                                                }
                                          )
                            }

                            const tipo = erp_order.TIPO == '1' ||  erp_order.TIPO == '2' && '1'
                        const obj =  {        
                                             id :  `#V-${codigo_sistema}` , 
                                             id_externo :   String(codigo_sistema)   ,
                                             id_interno :   String(codigo_sistema) ,
                                             vendedor :  erp_order.VENDEDOR ,
                                             situacao :   erp_order.SITUACAO ,
                                             situacao_separacao :  erp_order.SIT_SEPAR ,
                                             contato :  erp_order.CONTATO ,
                                             descontos :  erp_order.DESC_PROD ,
                                             frete: erp_order.VALOR_FRETE,
                                             forma_pagamento :  erp_order.FORMA_PAGAMENTO ,
                                             observacoes : erp_order.OBSERVACOES || ''  ,
                                             observacoes2 : erp_order.OBSERVACOES2 || ''   ,
                                             quantidade_parcelas :  erp_order.QTDE_PARCELAS  ,
                                             total_geral :  erp_order.TOTAL_GERAL ,
                                             total_produtos : erp_order.TOTAL_PRODUTOS ,
                                             total_servicos :  erp_order.TOTAL_SERVICOS ,
                                             cliente : {
                                                 codigo :  Number(arrClient[0].id_mobile)   
                                            },
                                             veiculo :  erp_order.VEICULO ,
                                             data_cadastro :    erp_order.DATA_CADASTRO ,
                                             data_recadastro :   dateService.obterDataHoraAtual() ,
                                             tipo_os :   erp_order.TIPO_OS ,
                                             enviado : "S",
                                             tipo :  Number(erp_order.TIPO) ,
                                             produtos:  prod,
                                             servicos : [],
                                             parcelas :   parcelas,
                                             operacao : 'V'

                                        }
                                        
                                     
                                     return obj;

            }else{
                console.log(`[X] Não foi encontrado pedido codigo: ${codigo_sistema} no sistema.`)

            }

}