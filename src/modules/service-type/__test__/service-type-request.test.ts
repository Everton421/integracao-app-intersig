import test from "node:test";
import { api } from "../../../services/api.ts";
import { isAxiosError } from "axios";
import assert from "node:assert";
import { ServiceTypeRequest } from "../service-type-request.ts";

test('service-type-request', async (t) => {

    await t.test("ServiceTypeRequest.post", async () => {
        const resultRequest = await ServiceTypeRequest.post({
            codigo: 1,
            id: 1,
            descricao: 'tipo de os teste',
            data_cadastro: '2026-07-09 00:00:00',
            data_recadastro: '2026-07-09 00:00:00',
        })
        console.log(resultRequest)
        assert.strictEqual(resultRequest.data?.codigo, 1)
    })

    // await t.test("ServiceTypeRequest.put", async () => {
    //    const resultRequest = await ServiceTypeRequest.put(
    //      {
    //            id: 1,
    //            descricao: 'tipo de os teste atualizado',
    //            data_cadastro: '2026-07-09 00:00:00',
    //            data_recadastro: '2026-07-09 00:00:00',
    //        },
    //        1
    //      )
    //    assert.strictEqual(resultRequest.data?.codigo, 1)
    // })

})
