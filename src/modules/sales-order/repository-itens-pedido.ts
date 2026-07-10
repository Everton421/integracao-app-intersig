import { type ResultSetHeader } from "mysql2"
import dbConn, { MOBILE, PUBLICO, VENDAS } from "../../database/connection/database-connection.ts"
import { type par_orca } from "./contracts/par_orca.ts"
import { type pro_orca } from "./contracts/pro_orca.ts"

export interface IServicosPedidoSistema {
    pedido: number
    desconto: number
    quantidade: number
    preco: number
    total: number
    id: number,
    valor: number,
    codigo: number
}
export type IProdutoPedidoSistema = {
    orcamento: number
    desconto: number
    sequencia: number
    quantidade: number
    preco: number
    total: number
    id?: number
    codigo: number
    frete: number
    just_icms: string
    just_ipi: string
    just_subst: string
    fator_val: number
    fator_qtde: number
    tabela: number
    quantidade_separada: number
    quantidade_faturada: number
    controle_lote_serie: 'S' | 'N'
    series: seriesProdutoPedido[]
}

interface seriesProdutoPedido {
    lote_serie: number,
    quantidade: string,
    serie: string | null,
    lote: string | null
}
export interface IParcelasPedidoSistema {
    pedido: number
    parcela: number
    valor: number
    vencimento: string
    dt_pagamento: string
    id: number
    tipo_receb: number
}



type resultselectProdutoDoPedido = pro_orca & { controle_lote_serie: 'S' | 'N' }



type resultSeriesPedidoVenda = {
    CODIGO: number
    QTDE_SEPARADA: number,
    SERIE: string
    LOTE: string | null
}




export class repositoryItensSalesOrder {
    static async deleteInstallmentsSalesOrder(codigoPedido: number) {
        const sql = `DELETE FROM ${VENDAS}.par_orca WHERE ORCAMENTO = ${codigoPedido}`;
        const [rows] = await dbConn.query(sql);
        return rows as ResultSetHeader;
    }


    static async deleteProductsSalesOrder(codigoPedido: number) {
        const sql = `DELETE FROM ${VENDAS}.pro_orca WHERE ORCAMENTO = ${codigoPedido}`
        const [rows] = await dbConn.query(sql);
        return rows as ResultSetHeader;
    }

    static async insertProductsSalesOrder(produtos: IProdutoPedidoSistema[], codigoPedido: number) {

        if (produtos.length > 0) {
            let i = 1;
            for (let p of produtos) {
                let {
                    id,
                    codigo,
                    preco,
                    quantidade,
                    desconto,
                    just_icms,
                    just_ipi,
                    just_subst,
                    total,
                    fator_val,
                    fator_qtde,
                    tabela,
                    frete,
                    quantidade_separada,
                    quantidade_faturada,
                } = p

                if (!preco) preco = 0;
                if (!quantidade) quantidade = 0;
                if (!desconto) desconto = 0;
                if (!just_icms) just_icms = '';
                if (!just_ipi) just_ipi = '';
                if (!just_subst) just_subst = '';
                if (!total) total = 0;
                if (!fator_val) fator_val = 1;
                if (!fator_qtde) fator_qtde = 1;
                if (!tabela) tabela = 1;

                const sql = `INSERT INTO ${VENDAS}.pro_orca (orcamento, sequencia, produto, fator_val, qtde_separada, qtde_faturada, fator_qtde, unitario, quantidade, preco_tabela, desconto, tabela,  just_ipi, just_icms, just_subst, total_liq, unit_orig, frete)
                VALUES ( 
                    '${codigoPedido}',
                    '${i}',
                    '${id}',
                    '${fator_val}',
                    '${quantidade_separada}',
                    '${quantidade_faturada}',
                    '${fator_qtde}',
                    '${preco}',
                    '${quantidade}',
                    '${preco}',
                    '${desconto}',  
                    '${tabela}',  
                    '${just_ipi}',  
                    '${just_icms}',  
                    '${just_subst}',  
                    '${total}',  
                    '${preco}',
                    '${frete}'  
                ) `;

                await dbConn.query(sql)

                if (i === produtos.length) {
                    return;
                }
                i++;
            }
        } else {
            console.log('nenhum produto informado')
        }

    }

    static async insertServicesSalesOrder(servicos: IServicosPedidoSistema[], codigo_pedido: number) {
        if (servicos.length > 0) {
            let j = 1;

            for (let i of servicos) {
                const sql = ` INSERT INTO ${VENDAS}.ser_orca ( ORCAMENTO , SEQUENCIA, SERVICO, QUANTIDADE, UNITARIO, DESCONTO, PRECO_TABELA )
                            VALUES ( ?, ?, ?, ?, ?, ?, ?  ) `;
                const values = [codigo_pedido, j, i.id, i.quantidade, i.valor, i.desconto, i.valor]


                await dbConn.query(sql, values);

                if (j === servicos.length) {
                    return;
                }
                j++;
            }
        }
    }


    static async findSeriesSalesOrder(codigo_pedido: number) {
        const sql = `SELECT 
            ls.CODIGO,
            lso.QTDE_SEPARADA,
            ls.SERIE,
            ls.LOTE 
                    FROM ${VENDAS}.lotes_series_orca lso 
                    JOIN ${PUBLICO}.lotes_series ls
                    on ls.CODIGO = lso.LOTE_SERIE
                    WHERE lso.ORCAMENTO = '${codigo_pedido}'
            `
        const [rows] = await dbConn.query(sql);
        return rows as resultSeriesPedidoVenda[]
    }

    static async insertInstallmenstSalesOrder(parcelas: IParcelasPedidoSistema[], codigo_pedido: number) {

        for (const p of parcelas) {
            const sql = ` INSERT INTO ${VENDAS}.par_orca ( ORCAMENTO, PARCELA, VALOR , VENCIMENTO, TIPO_RECEB)
                              VALUES ( ?,?,?,?,?)`;
            const values = [codigo_pedido, p.parcela, p.valor, p.vencimento, 1]
            await dbConn.query(sql, values);
        }
    }


    static async findInstallmentsSalesOrder(codigo_pedido: number) {

        const sql = ` SELECT 
                     *,
                    DATE_FORMAT(VENCIMENTO, '%Y-%m-%d') AS  VENCIMENTO
                     from ${VENDAS}.par_orca
                      where  orcamento = ?  `;
        const values = [codigo_pedido]
        const [rows] = await dbConn.query(sql, values);
        return rows as par_orca[];

    }
    static async deleteServicesSalesOrder(codigoPedido: number) {
        const sql = `DELETE FROM ${VENDAS}.ser_orca WHERE ORCAMENTO = ${codigoPedido}`
        const [rows] = await dbConn.query(sql);
        return rows as ResultSetHeader;
    }


    static async findItemsSalesOrder(codigo_pedido: number) {

        const sql = ` SELECT 
                    p.*,
                    pe.id_mobile as id,
                    cp.CONTR_LOTE_SERIE as controle_lote_serie
                     from ${VENDAS}.pro_orca p
                     join ${MOBILE}.produtos_enviados pe on pe.codigo_sistema = p.PRODUTO
                     join ${PUBLICO}.cad_prod cp on cp.CODIGO = p.PRODUTO
                 
                      where p.orcamento = ?  `;
        const values = [codigo_pedido]
        const [rows] = await dbConn.query(sql, values);
        return rows as resultselectProdutoDoPedido[];

    }




}