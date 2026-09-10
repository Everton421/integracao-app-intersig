import test from "node:test";
import { ReceiveProdSector } from "../services/receive-prod-sector-service.ts";
import { ProdSectorDataAcess } from "../data-acess/prod-sector-data-acess.ts";
import dbConn, { ESTOQUE } from "../../../database/connection/database-connection.ts";
 

test("TEST RECEIVE PROD SECTOR ", async ( t )=>{

    await t.test("ReceiveProdSector", async ( )=>{
        
        const receiveProdSector = new ReceiveProdSector(
            new ProdSectorDataAcess(dbConn),
            String(ESTOQUE)
        );

           const resultRequestProdSector = await receiveProdSector.recebiveByEvent({
                data_recadastro: '2026-09-10 13:29:38',
                estoque: 10,
                id_produto: "2" ,
                id_setor: "1",
                local1_produto: '',
                local2_produto:'',
                local3_produto:'',
                local4_produto:'',
                local_produto:'',
                produto:2,
                setor:1
            })

            console.log(resultRequestProdSector)
    })
})