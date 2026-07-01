import { getBrand } from "../modules/brands/repository-brand.ts";
import { serviceSendBrands } from "../modules/brands/service-send-brands.ts";

const data = await getBrand();
for (const i of data) {
  await serviceSendBrands({
    criado_em: i.DATA_CADASTRO, dados_json: String(i), id: 0,
    id_evento: i.CODIGO, id_message: '0', id_registro: i.CODIGO,
    setor: 1, status: 'PROCESSADO', tabela: 0,
    tabela_origem: 'cad_pmar', tipo_evento: 'UPDATE'
  });
}
