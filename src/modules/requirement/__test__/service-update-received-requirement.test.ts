import test from "node:test";
import { UpdateReceivedRequirementService } from "../use-cases/update-received-requirement.ts";



test("", async ( t )=>{

   await t.test("syncDataByEvent", async ()=>{
      
                await UpdateReceivedRequirementService.receive(
                    {
                    codigo: 855929,
                            data_requerimento: "2026-07-17",
                            requerente: 1,
                            data_efetuacao: "2026-07-17",
                            responsavel: 1,
                            pedido: null,
                            setor_origem: 1,
                            setor_destino: 2,
                            historico: "Teste de recebimento de requerimento",
                            situacao: "A",
                            itens: [
                                {
                                    produto: 55913,
                                    descricao: "Produto Teste",
                                    quantidade: 2,
                                    custo: 0,
                                    lotes_series: [
                                    {
                                        lote_serie: 1500015,
                                        quantidade: 1
                                    },{
                                        lote_serie: 1500016,
                                        quantidade: 1
                                        
                                    }                        
                                    ]
                                }
                            ]
                }
            )
 
    
    })
    })

 