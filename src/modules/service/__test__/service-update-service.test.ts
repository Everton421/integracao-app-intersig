import test from "node:test";
import { ServiceUpdateService } from "../service-update-service.ts";

test('service-update-service', async (t) => {

    await t.test("teste atualizacao do servico", async () => {
        await ServiceUpdateService.update(1, 1)
    })
})
