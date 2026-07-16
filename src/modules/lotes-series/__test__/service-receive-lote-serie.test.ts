import assert from "node:assert";
import test from "node:test";
import { LoteSeriesRequest } from "../lotes-series-request.ts";
import { ReceiveLoteSerieService } from "../service-receive-lote-serie.ts";




test( "receive-lote-serie.test", async ( t )=>{

   //await t.test('LoteSeriesRequest.getLoteSeriesRequest', async ()=>{
   //    const resultloteSerieResquest = await LoteSeriesRequest.getLoteSeriesRequest(1500008)
   //    assert.strictEqual(resultloteSerieResquest.length , 1  )
   // })
        
    await t.test('receiveLoteSerieService.receive', async ()=>{
        
          const resultReceiveLoteSerieService =  await ReceiveLoteSerieService.receiveLoteSerieByCode(5)
 
          console.log(resultReceiveLoteSerieService)
      })
    
})
 
   