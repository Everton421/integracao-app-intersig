import test from "node:test";
import { ServiceSyncCategories } from "../service-sync-categories.ts";





test(' service sync categories ', async (t) => {

    await t.test(" ServiceSyncCategories.syncData ", async () => {
        const result = await ServiceSyncCategories.syncData({
            criado_em: '',
            dados_json: '',
            id: 1,
            id_evento: 1,
            id_message: '',
            id_registro: 163,
            setor: 0,
            status: 'PROCESSADO',
            tabela: 0,
            tabela_origem: 'cad_pgru',
            tipo_evento: "UPDATE",

        })
        console.log(result);
    })
})
