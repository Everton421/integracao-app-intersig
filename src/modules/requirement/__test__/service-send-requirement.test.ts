import test from "node:test";
import { ServiceSyncRequeriment } from "../service-sync-requirement.ts";



 


test("", async ( t )=>{

    const codeRequeriment = 855812;
    t.test("syncDataByEvent", async ()=>{
        
        const resultSyncSevice = await ServiceSyncRequeriment.syncDataByEvent(
             {
                criado_em:'', dados_json:'', id:1,id_evento:1, id_message:'', id_registro:855812, setor:1, status:'PENDENTE',tabela: 0, tabela_origem:'requerimento', tipo_evento:'UPDATE'
             }
            );
            console.log(resultSyncSevice)
        
    })
    
    })

 