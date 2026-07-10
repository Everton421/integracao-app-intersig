import test from "node:test";
import { ServiceSyncLotesSeries } from "../service-sync-lotes-series.ts";

test('service-sync-lotes-series', async (t) => {

    await t.test("teste sync syncData do lote/serie", async () => {
        const result = await ServiceSyncLotesSeries.syncData({
            id: 1,
            tabela_origem: 'lotes_series',
            id_registro: 1500012,
            tipo_evento: 'INSERT',
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
