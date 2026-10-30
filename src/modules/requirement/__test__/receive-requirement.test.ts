import test from "node:test";
import assert from "node:assert";
import { type EventRequirement } from "../contracts/event-requirement.ts";
import { ReceiveRequirement } from "../use-cases/receive-requirement.ts";


test("TESTE recebimento do requerimento | classe receive-requirement", async (t) => {

    await t.test("TESTE ReceiveRequirement.receive", async () => {
        const mockEvent: EventRequirement = {
            codigo: 870457,
            data_requerimento: "2026-10-30",
            requerente: 1,
            data_efetuacao: "2026-10-30",
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
                    quantidade: 1,
                    custo: 0,
                    lotes_series: [
                    ]
                }
            ]
        };

        const result = await ReceiveRequirement.receive(mockEvent);
        console.log(result)
        assert.strictEqual(result.success, true);
    });

});
