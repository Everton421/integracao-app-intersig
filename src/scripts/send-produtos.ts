import { getProduct } from "../modules/products/repository-produto.ts";
import { serviceSendProduct } from "../modules/products/service-send-product.ts";

const data = await getProduct();
if (data.length > 0) {
  for (const i of data) {
    await serviceSendProduct({
      criado_em: i.data_cadastro,
      dados_json: String(i),
      id: 0, id_evento: 0, id_message: '0',
      id_registro: i.codigo, setor: 0,
      status: 'PROCESSADO', tabela: 0,
      tabela_origem: 'cad_prod', tipo_evento: 'UPDATE'
    });
  }
}
