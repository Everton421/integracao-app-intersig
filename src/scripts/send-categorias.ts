import { getCategory } from "../modules/category/repository-category.ts";
import { ServiceSyncCategories } from "../modules/category/service-sync-categories.ts";

const data = await getCategory();
for (const i of data) {
  await ServiceSyncCategories.syncData({
    criado_em: i.DATA_CADASTRO, dados_json: String(i), id: 0,
    id_evento: i.CODIGO, id_message: '0', id_registro: i.CODIGO,
    setor: 1, status: 'PROCESSADO', tabela: 0,
    tabela_origem: 'cad_pgru', tipo_evento: 'UPDATE'
  });
}
