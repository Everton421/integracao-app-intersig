import { getSetores } from "../modules/sector/repository-setor.ts";
import { serviceSendSetor } from "../modules/sector/service-send-setor.ts";

const data = await getSetores();
for (const i of data) {
  await serviceSendSetor({
    criado_em: i.DATA_CADASTRO, dados_json: String(i), id: 0,
    id_evento: i.CODIGO, id_message: '0', id_registro: i.CODIGO,
    setor: 1, status: 'PROCESSADO', tabela: 0,
    tabela_origem: 'setores', tipo_evento: 'UPDATE'
  });
}
