import test from "node:test";
import { ServiceSyncSupplier } from "../service-sync-supplier.ts";

test('service-sync-supplier', async (t) => {

    await t.test("teste sync INSERT do fornecedor", async () => {
        const result = await ServiceSyncSupplier.syncData({
            id: 1,
            tabela_origem: 'cad_forn',
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
