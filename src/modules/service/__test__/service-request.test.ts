import test from "node:test";
import { api } from "../../../services/api.ts";
import { isAxiosError } from "axios";
import assert from "node:assert";
import { ServiceRequest } from "../service-request.ts";

test('service-request', async (t) => {

    await t.test("ServiceRequest.post", async () => {
        const resultRequest = await ServiceRequest.post({
            codigo: 1,
            id: '1',
            descricao: 'servico teste',
            valor: 0,
            aplicacao: '',
            tipo_serv: 0,
            data_cadastro: '2026-07-09 00:00:00',
            data_recadastro: '2026-07-09 00:00:00',
        })
        console.log(resultRequest)
        assert.strictEqual(resultRequest.data?.codigo, 1)
    })

    // await t.test("ServiceRequest.put", async () => {
    //    const resultRequest = await ServiceRequest.put(
    //      {
    //            id: '1',
    //            descricao: 'servico teste atualizado',
    //            valor: 0,
    //            aplicacao: '',
    //            tipo_serv: 0,
    //            data_cadastro: '2026-07-09 00:00:00',
    //            data_recadastro: '2026-07-09 00:00:00',
    //        },
    //        1
    //      )
    //    assert.strictEqual(resultRequest.data?.codigo, 1)
    // })

})
