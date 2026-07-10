import test from "node:test";
import { ServiceSendService } from "../service-send-service.ts";

test('service-send-service', async (t) => {

    await t.test("teste envio do servico", async () => {
        await ServiceSendService.send(1)
    })
})
