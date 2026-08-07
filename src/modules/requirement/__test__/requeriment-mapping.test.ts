import test from "node:test"
import dbConn, { PUBLICO, VENDAS } from "../../../database/connection/database-connection.ts"
import { type erpRequeriment, type loteSerieRequer, type prodRequer } from "../contracts/erpRequirement.ts"
import { RequerimentMapping } from "../requeriment-mapping-for-mobile.ts"
import { RequirementDataAcess } from "../requirement-data-acess.ts"




test("", async ( t )=>{
    await t.test("TESTE  mapping requirement", async ()=>{
        const codeRequeriment = 855812;

            const ErpRequirement  =  await RequirementDataAcess.findRequeriments({ codigo: codeRequeriment})
         
            const ErpProdRequer  = await RequirementDataAcess.findProductsRequeriment(codeRequeriment);

             const loteSerieRequer =   await RequirementDataAcess.findLoteSeriesRequeriment(codeRequeriment);


      const resultMapping =  RequerimentMapping.mapping(ErpRequirement[0], ErpProdRequer, loteSerieRequer)
        console.log(resultMapping);
    })

})