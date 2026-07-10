import test from "node:test";
import { ServiceSendBrand } from "../service-send-brand.ts";



test('service-send-brand', async (t) => {

    await t.test("teste envio da marca do produto", async () => {
        await ServiceSendBrand.send(1463)

    })
})