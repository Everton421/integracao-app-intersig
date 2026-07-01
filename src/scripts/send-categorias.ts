import { getCategory } from "../modules/category/repositry-category.ts";
import { serviceSendCategory } from "../modules/category/service-send-category.ts";

const data = await getCategory();
for (const i of data) {
  await serviceSendCategory({
    criado_em: i.DATA_CADASTRO, dados_json: String(i), id: 0,
    id_evento: i.CODIGO, id_message: '0', id_registro: i.CODIGO,
    setor: 1, status: 'PROCESSADO', tabela: 0,
    tabela_origem: 'cad_pgru', tipo_evento: 'UPDATE'
  });
}
