import dbConn, { VENDAS } from "../../database/connection/database-connection.ts";
import { DateService } from "../../utils/date.ts";
import { ServiceSyncSupplier } from "../supplier/service-sync-supplier.ts";

import { PurchaseOrderRepository } from "./repository-purchase-order.ts";


type typeresultDefaultSector = { SETOR: number };




export class PurchaseOrderMapper {
    static async mapping(systemCode: number) {

        const dateService = new DateService();

        const result_erp_order = await PurchaseOrderRepository.findPurchaseOrderErp(systemCode);

        if (result_erp_order.length > 0) {
            const erp_order = result_erp_order[0];
            const arr_produtos = await PurchaseOrderRepository.findItemsPurchaseOrder(systemCode);
            let arrForn = await PurchaseOrderRepository.selectFornecedorPedido(erp_order.FORNECEDOR)

            if (arrForn.length === 0) {
                    console.log(`[X] Não foi encontrado registro do envio do fornecedor do pedido de compra codigo: ${systemCode}.`)
                console.log(`[V] Tentando fazer o envio do  fornecedor[ERP] : ${erp_order.FORNECEDOR} ...`)
                
                const resultServiceSendSupplier = await ServiceSyncSupplier.syncData({ id_registro: erp_order.FORNECEDOR, criado_em: '', dados_json: '', id: 0, id_evento: 0, id_message: '', setor: 0, status: 'PENDENTE', tabela: 0, tabela_origem: '', tipo_evento: 'INSERT' })
                if (resultServiceSendSupplier.success) {
                      console.log(`[V] Fornecedor [ERP] : ${erp_order.FORNECEDOR} enviado `)

                    arrForn = await PurchaseOrderRepository.selectFornecedorPedido(erp_order.FORNECEDOR)
                }else{
                        console.log(`[X] Não foi possivel enviar o forncedor [ERP] ${erp_order.FORNECEDOR}, resultado da tentativa de envio ${resultServiceSendSupplier}`)
                            console.log(`[X]  Pedido de compra [ERP] ${erp_order.CODIGO} não poderá ser enviado`)

                        console.log(resultServiceSendSupplier)
                        return ;
                }
            }


            const prod: any = []
            if (arr_produtos.length > 0) {
                for (const i of arr_produtos) {

                    const series = []
                    const resultSeries = await PurchaseOrderRepository.findSeriesPurchaseOrder(systemCode);
                    for (const serie of resultSeries) {
                        series.push({
                            lote_serie: Number(serie.CODIGO),
                            quantidade: String(serie.QTDE_SEPARADA),
                            serie: String(serie.SERIE),
                            lote: null
                        })
                    }
                    prod.push(
                        {
                            pedido: systemCode,
                            codigo: i.PRODUTO,
                            sequencia: i.SEQUENCIA,
                            desconto: i.DESCONTO || 0,
                            quantidade: i.QUANTIDADE,
                            preco: i.UNITARIO,
                            total: (i.UNITARIO * i.QUANTIDADE) - (i.QUANTIDADE * i.DESCONTO),
                            quantidade_faturada: i.QTDE_FATURADA,
                            quantidade_separada: i.QTDE_SEPARADA,
                            controle_lote_serie: i.controle_lote_serie,
                            series: series
                        }
                    )
                }
            } else {
                console.log(`[X] Não foi encontrado produtos do pedido de compra codigo: ${systemCode} no sistema.`)
                return;
            }

            const arr_parcelas = await PurchaseOrderRepository.findInstallmentsPurchaseOrder(systemCode);

            const parcelas: any[] = []
            for (const i of arr_parcelas) {
                parcelas.push({
                    pedido: systemCode,
                    parcela: i.PARCELA,
                    valor: i.VALOR,
                    vencimento: i.VENCIMENTO
                }
                )
            }


            const [resultDefaultSector] = await dbConn.query(` SELECT SETOR from  ${VENDAS}.empresas_setor 
                                WHERE FILIAL = ( SELECT MIN(FILIAL) FROM ${VENDAS}.empresas_setor)
                                AND PADRAO_VENDA = 'X'  Limit 1`);

            const defaultSector = resultDefaultSector as typeresultDefaultSector[];
            let setor = defaultSector[0].SETOR;

            if (erp_order.SETOR > 0) {
                setor = erp_order.SETOR;
            }

            const obj = {
                codigo: systemCode,
                id: '#C-' + systemCode,
                id_externo: String(systemCode),
                id_interno: String(systemCode),
                fornecedor: {
                    codigo: Number(erp_order.FORNECEDOR)
                },
                vendedor: 0,
                situacao: String(erp_order.SITUACAO),
                situacao_separacao: erp_order.SIT_SEPAR,
                contato: erp_order.CONTATO,
                descontos: erp_order.DESC_PROD,
                frete: erp_order.VALOR_FRETE != null  ?  erp_order.VALOR_FRETE :  0,
                forma_pagamento: erp_order.FORMA_PAGAMENTO,
                observacoes: erp_order.OBSERVACOES || "",
                observacoes2: erp_order.OBSERVACOES || "",
                quantidade_parcelas: arr_parcelas.length,
                total_geral: erp_order.TOTAL_GERAL,
                total_produtos: erp_order.TOTAL_PRODUTOS,
                total_servicos: erp_order.TOTAL_SERVICOS,
                cliente: {
                    codigo: 0
                },
                veiculo: 0,
                data_cadastro: erp_order.DATA_CADASTRO,
                data_recadastro: dateService.obterDataHoraAtual(),
                tipo_os: 0,
                enviado: "S",
                tipo: 6,
                produtos: prod,
                servicos: [],
                parcelas: parcelas,
                operacao: 'C',
                setor: setor || 1

            }
            return obj;

        } else {
            console.log(`[X] Não foi encontrado pedido codigo: ${systemCode} no sistema.`)

        }
    }
}