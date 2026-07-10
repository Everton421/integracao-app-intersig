import test from "node:test";
import { ServiceSendCategory } from "../service-send-category.ts";
import { ServiceUpdateCategory } from "../service-update-category.ts";



test('service-update-category', async (t) => {

    await t.test("teste atualização da categoria do produto", async () => {
        await ServiceUpdateCategory.update(163, 163)

    })
})
