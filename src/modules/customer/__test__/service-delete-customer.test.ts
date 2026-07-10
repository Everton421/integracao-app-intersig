import assert from "node:assert";
import test from "node:test";
import { DeleteCustomerService } from "../delete-customer-service.ts";



test('service-delete-customer', async (t) => {


  await t.test("teste exclusao cliente sem registro de sincronização", async () => {
   const resultDeleteCustomerService = await DeleteCustomerService.delete(5000000);
    console.log(resultDeleteCustomerService)
     assert.strictEqual(resultDeleteCustomerService.success ,false );
  })

   await t.test("teste exclusao cliente com registro de sincronização", async () => {
   const resultDeleteCustomerService = await DeleteCustomerService.delete(226492);
    console.log(resultDeleteCustomerService)
     assert.strictEqual(resultDeleteCustomerService.success ,true );
    })

})
