import test from "node:test";
import { ServiceUpdateSupplier } from "../service-update-supplier.ts";

test('service-update-supplier', async (t) => {

    await t.test("teste atualizacao do fornecedor", async () => {
        await ServiceUpdateSupplier.update(1, 1)
    })
})
