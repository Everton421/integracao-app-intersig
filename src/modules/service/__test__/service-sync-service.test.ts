import test from "node:test";
import { ServiceSyncService } from "../service-sync-service.ts";

test('service-sync-service', async (t) => {

    await t.test("teste sync do servico", async () => {
        const result = await ServiceSyncService.syncData({
            id: 1,
            tabela_origem: 'cad_serv',
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
