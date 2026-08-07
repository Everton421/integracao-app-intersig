import test from "node:test";
import { type EventRequirement } from "../contracts/event-requirement.ts";
import { ReceiveRequirementSubmitted } from "../use-cases/receive-requirement-submitted.ts";
import assert from "node:assert";

  
  
  
  test("TESTE  efetuando requerimento | classe  receive-requirement-submitted", async (t) => {
  
      await t.test("TESTE ReceiveRequirementSubmitted.receive", async () => {

  const mockEvent: EventRequirement = {
            codigo: 855928,
            data_requerimento: "2026-07-17",
            requerente: 1,
            data_efetuacao: "2026-07-17",
            responsavel: 1,
            pedido: null,
            setor_origem: 1,
            setor_destino: 2,
            historico: "Teste de recebimento de requerimento",
            situacao: "E",
            itens: [
                {
                    produto: 55913,
                    descricao: "Produto Teste",
                    quantidade: 1,
                    custo: 0,
                    lotes_series: [
                    {
                        lote_serie: 1500015,
                        quantidade: 1
                    }                        
                    ]
                }
            ]
        };

                const result = await ReceiveRequirementSubmitted.receive(mockEvent);
                console.log(result)
                assert.strictEqual(result.success, true);


    })

})
