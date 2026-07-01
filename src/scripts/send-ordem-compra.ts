import { selectOrdemCompraSistema } from "../modules/sales-order/repository-pedido.ts";
import { serviceSendPurchaseOrder } from "../modules/purchase-order/service-send-purchase-order.ts";

const data = await selectOrdemCompraSistema();
if (data.length > 0) {
  for (const i of data) {
    await serviceSendPurchaseOrder({
      criado_em: i.DATA_CADASTRO, dados_json: String(i),
      tipo_evento: "INSERT", id: 0, id_evento: 0,
      id_message: '0', id_registro: i.CODIGO,
      setor: 0, status: "PROCESSADO", tabela: 0,
      tabela_origem: 'pro_comp'
    });
  }
}
