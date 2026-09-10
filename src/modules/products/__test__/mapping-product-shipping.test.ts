import test from "node:test";
import { MappingProductShipping } from "../mapping/mapping-product-shipping.ts";
import { ProductDataAcess } from "../data-acess/product-data-acess.ts";
import dbConn, { MOBILE, PUBLICO } from "../../../database/connection/database-connection.ts";

 test("MAPPING PRODUCT TO SHIPING"  ,async (t)=>{
        await t.test("MappingProductShipping", async ()=>{


                const dataAcess = new ProductDataAcess(dbConn);

                const [dataProduct] = await dataAcess.searchProductErp(String(PUBLICO), 2 )
                const [mappingToShipping] = await dataAcess.searchMappProducts(String(MOBILE));
              
         const mappingProductShipping = new MappingProductShipping();

           const payload =mappingProductShipping.mappingToShipping(    
            dataProduct,
               mappingToShipping
            )
            console.log(payload);

                })
 } )
 