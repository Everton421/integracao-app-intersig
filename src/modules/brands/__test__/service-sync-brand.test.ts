import test from "node:test";
import { ServiceSyncbrand } from "../service-sync-brands-.ts";




test(' service sync brand ', async (t) => {

    await t.test(" ServiceSyncbrand.syncData ", async () => {
        const result = await ServiceSyncbrand.syncData({
            criado_em: '',
            dados_json: '',
            id: 1,
            id_evento: 1,
            id_message: '',
            id_registro: 1463,
            setor: 0,
            status: 'PROCESSADO',
            tabela: 0,
            tabela_origem: 'cad_pmar',
            tipo_evento: "UPDATE",

        })
        console.log(result);
    })
})