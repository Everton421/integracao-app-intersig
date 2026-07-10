import test from "node:test";
import { ServiceSendCategory } from "../service-send-category.ts";



test('service-send-brand', async (t) => {

    await t.test("teste envio da categoria do produto", async () => {
      const result = await ServiceSendCategory.send(163)
        console.log(result)
    })
})