import dbConn, { ESTOQUE, MOBILE } from "../../../database/connection/database-connection.ts";
import { ApiClient } from "../../../services/api-client.ts";
import { LoteSerieRepository } from "../repository/lote-serie-repository.ts";
import { LoteSerieShipping } from "./lote-serie-shipping.ts";

export class LoteSerieShoppingFactory{

    static createShipping(){
        return new LoteSerieShipping(
            new LoteSerieRepository(dbConn, ESTOQUE!, MOBILE!),
            new ApiClient()
        )
    }
}