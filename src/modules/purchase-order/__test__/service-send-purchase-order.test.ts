import test from "node:test";
import { ServiceSendPurchaseOrder } from "../service-send-purchase-order.ts";



test('service-send-purchase-order', async (t) => {

    await t.test("teste envio pedido de compra ", async () => {
     const result =   await   ServiceSendPurchaseOrder.send({
             criado_em: '',
            dados_json: '',
            id: 1,
            id_evento: 1,
            id_message: '',
            id_registro: 94858,
            setor: 0,
            status: 'PROCESSADO',
            tabela: 0,
            tabela_origem: 'pro_comp',
            tipo_evento: "INSERT",

        })
console.log(result)
    })
})
