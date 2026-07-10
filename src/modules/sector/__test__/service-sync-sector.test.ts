import test from "node:test";
import { ServiceSyncSector } from "../service-sync-sector.ts";

test('service-sync-sector', async (t) => {

    await t.test("teste sync INSERT do setor", async () => {
        const result = await ServiceSyncSector.syncData({
            id: 1,
            tabela_origem: 'setores',
            id_registro: 566,
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
