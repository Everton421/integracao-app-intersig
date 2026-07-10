import test from "node:test";
import { ServiceUpdateLoteSerie } from "../service-update-lote-serie.ts";

test('service-update-lote-serie', async (t) => {

    await t.test("teste atualizacao do lote/serie", async () => {
        await ServiceUpdateLoteSerie.update(1500008, 1500008)
    })
})
