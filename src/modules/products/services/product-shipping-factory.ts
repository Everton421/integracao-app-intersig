import dbConn, { MOBILE, PUBLICO } from "../../../database/connection/database-connection.ts";
import { ApiClient } from "../../../services/api-client.ts";
import { ProductDataAcess } from "../data-acess/product-data-acess.ts";
import { MappingProductShipping } from "../mapping/mapping-product-shipping.ts";
import { ProductShippingService } from "./product-shipping-service.ts";

export class ProductShippingFactory{
    static createProductShipping(){
        const mappingProductShipping = new MappingProductShipping();
        const productDataAcess = new ProductDataAcess(dbConn);
        const apiClient = new ApiClient();

return new ProductShippingService(
      mappingProductShipping,
       productDataAcess,
      String(PUBLICO),
      String(MOBILE),
      apiClient
);
    }
}