import test from "node:test";
import { ServiceSendCustomer } from "../service-send-customer.ts";



test('service-send-customer', async (t) => {

    await t.test("teste envio do cliente", async () => {
        await ServiceSendCustomer.send(226492)

    })
})
