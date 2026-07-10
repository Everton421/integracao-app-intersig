import assert from "node:assert";
import test from "node:test";
import { DeleteCategoryService } from "../delete-category-service.ts";



test('service-delete-category', async (t) => {


  await t.test("teste exclusao categoria sem registro de sincronização", async () => {
   const resultDeleteCategoryService = await DeleteCategoryService.delete(5000);
    console.log(resultDeleteCategoryService)
     assert.strictEqual(resultDeleteCategoryService.success ,false );
  })

   await t.test("teste exclusao categoria com registro de sincronização", async () => {
   const resultDeleteCategoryService = await DeleteCategoryService.delete(163);
    console.log(resultDeleteCategoryService)
     assert.strictEqual(resultDeleteCategoryService.success ,true );
    })

})
