import test from "node:test";
import { ServiceSendBrand } from "../service-send-brand.ts";
import { ServiceUpdateBrand } from "../service-update-brand.ts";



test('service-update-brand', async (t) => {

    await t.test("teste atualização da marca do produto", async () => {
        await ServiceUpdateBrand.update(1463,1463 )

    })
})