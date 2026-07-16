import test from "node:test";
import { api } from "../../../services/api.ts";
import { isAxiosError } from "axios";
import assert from "node:assert";
import { LoteSeriesRequest } from "../lotes-series-request.ts";

test('lotes-series-request', async (t) => {
//
   // await t.test("LoteSeriesRequest.post", async () => {
   //     const resultRequest = await LoteSeriesRequest.post({
   //         codigo: 1500008,
   //         produto: 13456,
   //         lote: null,
   //         serie: 'WCC2E4AT9UL91B',
   //     })
   //     console.log(resultRequest)
   //     assert.strictEqual(resultRequest.data?.codigo, 1500008)
   // })

    // await t.test("LoteSeriesRequest.put", async () => {
    //    const resultRequest = await LoteSeriesRequest.put(
    //      {
    //            produto: 13456,
    //            lote: null,
    //            serie: 'WCC2E4AT9UL91B',
    //        },
    //        1500008
    //      )
    //    assert.strictEqual(resultRequest.data?.codigo, 1500008)
    // })

    await t.test("getLoteSeriesRequest", async ()=>{
        const data = await LoteSeriesRequest.getLoteSeriesRequest(5)
         console.log(data);
    })
})
