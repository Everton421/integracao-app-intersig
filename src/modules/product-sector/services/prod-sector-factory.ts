import dbConn, { ESTOQUE, MOBILE } from "../../../database/connection/database-connection.ts";
import { ApiClient } from "../../../services/api-client.ts";
import { ProductDataAcess } from "../../products/data-acess/product-data-acess.ts";
import { ProductShippingFactory } from "../../products/services/product-shipping-factory.ts";
import { ProdSectorDataAcess } from "../data-acess/prod-sector-data-acess.ts";
import { MappingProdSectorShipping } from "../mapping/mapping-prod-sector-shipping.ts";
import { ProdSectorShippingService } from "./prod-sector-shipping-service.ts";

export class ProdSectorFactory{
    static createProdSectorShippingService(){
        const productShippingService = ProductShippingFactory.createProductShipping();

        return new ProdSectorShippingService(
                new ProdSectorDataAcess(dbConn),
                productShippingService,
                new ProductDataAcess(dbConn),
                ESTOQUE!,
                MOBILE,
                new MappingProdSectorShipping(), 
                new ApiClient() 
        );
    }
}