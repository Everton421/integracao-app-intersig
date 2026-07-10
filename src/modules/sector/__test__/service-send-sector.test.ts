import test from "node:test";
import { ServiceSendSector } from "../service-send-sector.ts";

test('service-send-sector', async (t) => {

    await t.test("teste envio do setor", async () => {
        await ServiceSendSector.send(566)
    })
})
