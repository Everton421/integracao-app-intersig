import test from "node:test";
import { ServiceUpdateServiceType } from "../service-update-service-type.ts";

test('service-update-service-type', async (t) => {

    await t.test("teste atualizacao do tipo de os", async () => {
        await ServiceUpdateServiceType.update(1, 1)
    })
})
