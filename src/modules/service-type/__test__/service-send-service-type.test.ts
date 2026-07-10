import test from "node:test";
import { ServiceSendServiceType } from "../service-send-service-type.ts";

test('service-send-service-type', async (t) => {

    await t.test("teste envio do tipo de os", async () => {
        await ServiceSendServiceType.send(1)
    })
})
