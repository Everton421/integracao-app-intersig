import test from "node:test";
import { getAllClients } from "../repository-client.ts";

test('customer-repository', async (t) => {
    const data = await getAllClients(7703);
    console.log(data)
})
