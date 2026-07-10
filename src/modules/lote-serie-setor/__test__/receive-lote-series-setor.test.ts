import test from "node:test";
import { ReceiveLoteSerieSetor } from "../service-receive-lote-serie-setor.ts";
import assert from "node:assert";
 

test(" receive-lote-serie-setor ", async ( t )=>{

    
    await t.test("", async ()=>{
          const resultReceiveLoteSerieSetor = await ReceiveLoteSerieSetor.receive({ estoque: 1, lote_serie: 341824, produto: 29668, setor: 1})
            assert.strictEqual(resultReceiveLoteSerieSetor.success , true )
        })

})