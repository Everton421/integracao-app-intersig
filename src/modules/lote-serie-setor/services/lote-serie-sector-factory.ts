import dbConn, { ESTOQUE } from "../../../database/connection/database-connection.ts";
import { ApiClient } from "../../../services/api-client.ts";
import { LoteSerieSectorRepository } from "../repository/lote-serie-respository.ts";
import { LoteSerieSetorShipping } from "./lote-serie-setor-shipping.ts";


export  class LoteSerieSectorFactory {
     static createLoteSerieShopping(){
        return new LoteSerieSetorShipping(
            new LoteSerieSectorRepository(dbConn, ESTOQUE!),
            new ApiClient(),
        )
     }
}