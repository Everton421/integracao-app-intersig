import test from "node:test";
import { ServiceSyncCustomers } from "../service-sync-customers.ts";





test(' service sync customers ', async (t) => {

    await t.test(" ServiceSyncCustomers.syncData ", async () => {
        const result = await ServiceSyncCustomers.syncData({
            criado_em: '',
            dados_json: '',
            id: 1,
            id_evento: 1,
            id_message: '',
            id_registro: 94858,
            setor: 0,
            status: 'PROCESSADO',
            tabela: 0,
            tabela_origem: 'cad_clie',
            tipo_evento: "UPDATE",

        })
        console.log(result);
    })
})
