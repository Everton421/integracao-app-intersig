import assert from "node:assert";
import test from "node:test";
import { DeleteBrandService } from "../delete-brand-service.ts";



test('service-send-brand', async (t) => {


  await t.test("teste exclusao marca sem registro de sincronização", async () => {
   const resultDeleteBrandService = await DeleteBrandService.delete(5000);
    console.log(resultDeleteBrandService)
     assert.strictEqual(resultDeleteBrandService.success ,false );
  })

   await t.test("teste exclusao marca com registro de sincronização", async () => {
   const resultDeleteBrandService = await DeleteBrandService.delete(1463);
    console.log(resultDeleteBrandService)
     assert.strictEqual(resultDeleteBrandService.success ,true );
    })

})