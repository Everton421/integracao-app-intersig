import test from "node:test";
import { ServiceUpdateSector } from "../service-update-sector.ts";

test('service-update-sector', async (t) => {

    await t.test("teste atualizacao do setor", async () => {
        await ServiceUpdateSector.update(566, 566)
    })
})
