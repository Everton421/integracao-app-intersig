import { getAllClients } from "../modules/customer/repository-client.ts";
import { serviceSendClient } from "../modules/customer/service-send-client.ts";

const data = await getAllClients();
for (const i of data) {
  await serviceSendClient({
    criado_em: i.DATA_CADASTRO,
    dados_json: String(i), id: 0,
    id_evento: i.CODIGO, id_message: '0',
    id_registro: i.CODIGO, setor: 1,
    status: 'PROCESSADO', tabela: 0,
    tabela_origem: 'cad_clie', tipo_evento: 'UPDATE'
  });
}
