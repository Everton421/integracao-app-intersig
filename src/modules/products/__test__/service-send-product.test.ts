import test from "node:test";
import { serviceSendProduct } from "../service-send-product.ts";

 test("serviceSendProduct"  ,async (t)=>{
        await t.test("serviceSendProduct", async ()=>{
                await serviceSendProduct({
                        criado_em:'',
                        dados_json:'',
                        id:0,
                        id_evento: 0,
                        id_message:'',
                        id_registro: 55913,
                        setor:0,
                        status:'PENDENTE',
                        tabela: 0,
                        tabela_origem:'cad_prod',
                        tipo_evento:'INSERT'
                        })
                })
 } )