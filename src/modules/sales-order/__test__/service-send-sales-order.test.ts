import test from "node:test";
import { ServiceSyncSalesOrder } from "../service-sync-sales-orders.ts";



test('service-send-sales-order', async (t) => {

    await t.test("teste envio pedido de venda ", async () => {
     const result =   await   ServiceSyncSalesOrder.syncData({
             criado_em: '',
            dados_json: '',
            id: 1,
            id_evento: 1,
            id_message: '',
            id_registro: 1944061,
            setor: 0,
            status: 'PROCESSADO',
            tabela: 0,
            tabela_origem: 'cad_orca',
            tipo_evento: "INSERT",

        })
    })
})
