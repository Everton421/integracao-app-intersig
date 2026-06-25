import { selectClientePedido, selectFornecedorPedido, selectOrdemCompraSistema    } from "../sales-order/repository-pedido.ts";
import { serviceSendClient } from "../customer/service-send-client.ts";
import { DateService } from "../../utils/date.ts";
import { serviceSendSupplier } from "../supplier/service-send-supplier.ts";
import { selectParcelasPedidoCompra, selectProdutoDoPedidoDeCompra } from "../sales-order/repository-itens-pedido.ts";

export async function purchaseOrderMapper(codigo_sistema:number) {

            const dateService = new DateService();

            const result_erp_order= await selectOrdemCompraSistema(codigo_sistema);

            if(result_erp_order.length > 0 ){
                const erp_order =   result_erp_order[0];
                const arr_produtos = await selectProdutoDoPedidoDeCompra(codigo_sistema);
                let arrForn = await selectFornecedorPedido(erp_order.FORNECEDOR)

                if(arrForn.length === 0 ){
                    console.log(`[X] Não foi encontrado  fornecedor do pedido codigo: ${codigo_sistema} no sistema.`)
                     const resultServiceSendSupplier= await serviceSendSupplier({ id_registro: erp_order.FORNECEDOR, criado_em:'', dados_json:'', id:0, id_evento:0, id_message:'', setor:0, status:'PENDENTE', tabela:0, tabela_origem:'cad_clie', tipo_evento:'UPDATE'})
                     if(resultServiceSendSupplier?.sucess){
                        arrForn = await selectFornecedorPedido(erp_order.FORNECEDOR)
                     }
                    }


                    const prod:any=[]
                    if(arr_produtos.length >  0 ){
                        for( const i of arr_produtos ) {
                            prod.push(
                                                {
                                                     pedido : codigo_sistema,
                                                     codigo : i.PRODUTO,
                                                     sequencia: i.SEQUENCIA,
                                                     desconto : i.DESCONTO,
                                                     quantidade : i.QUANTIDADE,
                                                     preco : i.UNITARIO,
                                                     total : ( i.UNITARIO * i.QUANTIDADE ) - ( i.QUANTIDADE * i.DESCONTO),
                                                     quantidade_faturada : i.QTDE_FATURADA,
                                                     quantidade_separada : i.QTDE_SEPARADA
                                                }
                            )
                        }
                    }else{
                    console.log(`[X] Não foi encontrado produtos do pedido codigo: ${codigo_sistema} no sistema.`)
                        return;
                    }

                    const arr_parcelas = await selectParcelasPedidoCompra(codigo_sistema);

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
                        const obj =  {       codigo :  codigo_sistema ,
                                             id :  codigo_sistema ,
                                             id_externo :   ''   ,
                                             id_interno :   '' ,
                                             fornecedor: {
                                                 codigo: Number(arrForn[0].id_mobile)
                                             },
                                             vendedor :  0,
                                             situacao :  String(erp_order.SITUACAO)  ,
                                             situacao_separacao :  erp_order.SIT_SEPAR ,
                                             contato :  erp_order.CONTATO ,
                                             descontos :  erp_order.DESC_PROD ,
                                             frete: erp_order.VALOR_FRETE,
                                             forma_pagamento :  erp_order.FORMA_PAGAMENTO ,
                                             observacoes : erp_order.OBSERVACOES  || ""  ,
                                             observacoes2 : erp_order.OBSERVACOES  || ""  ,
                                             quantidade_parcelas :  arr_parcelas.length  ,
                                             total_geral :  erp_order.TOTAL_GERAL ,
                                             total_produtos : erp_order.TOTAL_PRODUTOS ,
                                             total_servicos :  erp_order.TOTAL_SERVICOS ,
                                             cliente : {
                                                 codigo :  0   
                                            },
                                             veiculo :  0 ,
                                             data_cadastro :    erp_order.DATA_CADASTRO ,
                                             data_recadastro :   dateService.obterDataHoraAtual() ,
                                             tipo_os :  0 ,
                                             enviado : "S",
                                             tipo :  6 ,
                                             produtos:  prod,
                                             servicos : [],
                                             parcelas :   parcelas, 
                                             operacao : 'C'
                                        }
                                     return obj;

            }else{
                console.log(`[X] Não foi encontrado pedido codigo: ${codigo_sistema} no sistema.`)

            }

}