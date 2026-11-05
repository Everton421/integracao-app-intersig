import test from "node:test";
import { ProdSectorFactory } from "../services/prod-sector-factory.ts";

 test("TEST PROD SECTOR SHIPPING", async ( t )=>{

    await t.test("ProdSectorShippingService", async ( )=>{

        const prodSectorShippingService = ProdSectorFactory.createProdSectorShippingService();

try {
 
    await prodSectorShippingService.bulkShippingProdSector();

} catch (error) {
        console.log(error)
}
    })

    
})