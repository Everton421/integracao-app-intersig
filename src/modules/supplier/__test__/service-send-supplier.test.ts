import test from "node:test";
import { ServiceSendSupplier } from "../service-send-supplier.ts";

test('service-send-supplier', async (t) => {

    await t.test("teste envio do fornecedor", async () => {
        await ServiceSendSupplier.send(1)
    })
})
