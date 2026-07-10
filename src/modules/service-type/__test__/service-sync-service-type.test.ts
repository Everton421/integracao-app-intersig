import test from "node:test";
import { ServiceSyncServiceType } from "../service-sync-service-type.ts";

test('service-sync-service-type', async (t) => {

    await t.test("teste sync  do tipo de os", async () => {
        const result = await ServiceSyncServiceType.syncData({
            id: 1,
            tabela_origem: 'tipos_os',
            id_registro: 1,
            tipo_evento: 'UPDATE',
            dados_json: null,
            status: 'PENDENTE',
            setor: 0,
            tabela: 0,
            id_message: null,
            id_evento: 1,
            criado_em: new Date().toISOString()
        })
        console.log(result)
    })
})
