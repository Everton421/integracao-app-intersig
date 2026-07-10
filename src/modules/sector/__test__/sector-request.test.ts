import test from "node:test";
import { api } from "../../../services/api.ts";
import { isAxiosError } from "axios";
import assert from "node:assert";
import { SectorRequest } from "../sector-request.ts";

test('sector-request', async (t) => {

    await t.test("SectorRequest.post", async () => {
        const resultRequest = await SectorRequest.post({
            codigo: 1,
            descricao: 'setor teste',
            data_cadastro: '2026-07-09',
            id: '1',
        })
        console.log(resultRequest)
        assert.strictEqual(resultRequest.data?.codigo, 1)
    })

    // await t.test("SectorRequest.put", async () => {
    //    const resultRequest = await SectorRequest.put(
    //      {
    //            descricao: 'setor teste atualizado',
    //            data_cadastro: '2026-07-09',
    //            id: '1',
    //        },
    //        1
    //      )
    //    assert.strictEqual(resultRequest.data?.codigo, 1)
    // })

})
