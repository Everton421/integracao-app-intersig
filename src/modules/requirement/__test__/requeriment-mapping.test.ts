import test from "node:test"
import dbConn, { PUBLICO, VENDAS } from "../../../database/connection/database-connection.ts"
import { type erpRequeriment, type loteSerieRequer, type prodRequer } from "../contracts/erpRequirement.ts"
import { RequerimentMapping } from "../requeriment-mapping.ts"
import { RequirementRepository } from "../repository-requirement.ts"




test("", async ( t )=>{
    await t.test("TESTE  mapping requirement", async ()=>{
        const codeRequeriment = 855812;

            const ErpRequirement  =  await RequirementRepository.findRequeriments({ codigo: codeRequeriment})
         
            const ErpProdRequer  = await RequirementRepository.findProductsRequeriment(codeRequeriment);

             const loteSerieRequer =   await RequirementRepository.findLoteSeriesRequeriment(codeRequeriment);


      const resultMapping =  RequerimentMapping.mapping(ErpRequirement[0], ErpProdRequer, loteSerieRequer)
        console.log(resultMapping);
    })

})