 import test from "node:test";
import { ProductShippingService } from "../services/product-shipping-service.ts";
import { MappingProductShipping } from "../mapping/mapping-product-shipping.ts";
import { ProductDataAcess } from "../data-acess/product-data-acess.ts";
import dbConn, { MOBILE, PUBLICO } from "../../../database/connection/database-connection.ts";
import { ApiClient } from "../../../services/api-client.ts";
 
 test("PRODUCT SHIPPING SERVICE"  ,async (t)=>{
        await t.test("shippingProduct", async ()=>{


       const service = new ProductShippingService(
        new MappingProductShipping(),
        new ProductDataAcess(dbConn),
        String(PUBLICO),
        String(MOBILE),
        new ApiClient()
       )


       const result = await service.shippingProduct(2)  
 })
 } )
 