import test from "node:test";
import { UpdateReceivedRequirementService } from "../service-update-received-requirement.ts";



test("", async ( t )=>{

   await t.test("syncDataByEvent", async ()=>{
      
                await UpdateReceivedRequirementService.receive(
                    {
                     codigo: 855923,
                     data_requerimento: "2026-07-30",
                     requerente: 999,
                     data_efetuacao: "2026-07-30",
                     responsavel: 999,
                     pedido: 0,
                     setor_origem: 1,
                     setor_destino: 448,
                     historico: "",
                     situacao: "A",
                     itens: [
                        {
                            produto: 56101,
                            descricao: "teste",
                            quantidade: 2,
                            custo: 0,
                            lotes_series: [
                            {
                                lote_serie: 1500024,
                                quantidade: 1
                            } 
                         ]
                        } 
                    ]
                }
            )
 
    
    })
    })

 