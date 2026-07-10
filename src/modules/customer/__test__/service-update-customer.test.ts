import test from "node:test";
import { ServiceSendCustomer } from "../service-send-customer.ts";
import { ServiceUpdateCustomer } from "../service-update-customer.ts";



test('service-update-customer', async (t) => {

    await t.test("teste atualização do cliente", async () => {
        await ServiceUpdateCustomer.update(226492, 226492)

    })
})
