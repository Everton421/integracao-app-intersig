import test from "node:test";
import { DeleteSupplierService } from "../delete-supplier-service.ts";

test('service-delete-supplier', async (t) => {

    await t.test("teste delecao do fornecedor", async () => {
        const result = await DeleteSupplierService.delete(1)
        console.log(result)
    })
})
