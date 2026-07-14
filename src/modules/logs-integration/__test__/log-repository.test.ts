import test from "node:test";
import { LogsRepository } from "../logs-repository.ts";


test("log repository", async ( t )=>{
        await t.test("Register log",async ()=>{
            const result = await LogsRepository.registerLogs({
                status:'erro'
            })
            console.log(result);
        })
})