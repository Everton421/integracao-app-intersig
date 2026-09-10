import test from "node:test";
import { ProdSectorShippingService } from "../services/prod-sector-shipping-service.ts";
import { ProdSectorDataAcess } from "../data-acess/prod-sector-data-acess.ts";
import dbConn, { ESTOQUE, MOBILE, PUBLICO } from "../../../database/connection/database-connection.ts";
import { ProductShippingService } from "../../products/services/product-shipping-service.ts";
import { MappingProductShipping } from "../../products/mapping/mapping-product-shipping.ts";
import { ProductDataAcess } from "../../products/data-acess/product-data-acess.ts";
import { ApiClient } from "../../../services/api-client.ts";
import { MappingProdSectorShipping } from "../mapping/mapping-prod-sector-shipping.ts";


test("TEST PROD SECTOR SHIPPING", async ( t )=>{

    await t.test("ProdSectorShippingService", async ( )=>{
            const productShippingService = new ProductShippingService(
        new MappingProductShipping(),
        new ProductDataAcess(dbConn),
        String(PUBLICO),
        String(MOBILE),
        new ApiClient()
       )
        const prodSectorShippingService = new ProdSectorShippingService(
            new ProdSectorDataAcess(dbConn),
             productShippingService,
             new ProductDataAcess(dbConn),
               ESTOQUE!,
                MOBILE,
                 new MappingProdSectorShipping(), 
                   new ApiClient() 
        );

      const result =   await prodSectorShippingService.shippingProdSector(2 ,1)
        console.log(result)
    })
})