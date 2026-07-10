import test from "node:test";
import { ServiceSendLoteSerie } from "../service-send-lote-serie.ts";

test('service-send-lote-serie', async (t) => {

    await t.test("teste envio do lote/serie", async () => {
        await ServiceSendLoteSerie.send(1500012)
    })
})
