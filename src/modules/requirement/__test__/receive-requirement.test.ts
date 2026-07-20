import test from "node:test";
import assert from "node:assert";
import { ReceiveRequirementService } from "../service-receive-requirement.ts";
import { type EventRequirement } from "../contracts/event-requirement.ts";


test("receive-requirement", async (t) => {

    await t.test("TESTE receive requirement", async () => {
        const mockEvent: EventRequirement = {
            codigo: 2,
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
                    quantidade: 1,
                    custo: 0,
                    lotes_series: [
                    ]
                }
            ]
        };

        const result = await ReceiveRequirementService.receive(mockEvent);
        assert.strictEqual(result.success, true);
    });

});
