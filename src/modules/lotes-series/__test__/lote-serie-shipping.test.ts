import test from 'node:test';
import { LoteSerieShipping } from '../service/lote-serie-shipping.ts';
import { LoteSerieRepository } from '../repository/lote-serie-repository.ts';
import dbConn, {     MOBILE, PUBLICO } from '../../../database/connection/database-connection.ts';
import { ApiClient } from '../../../services/api-client.ts';

test("lote-serie-shipping", async ()=>{

    const loteSerieShipping = new LoteSerieShipping(
        new LoteSerieRepository(dbConn, PUBLICO!, MOBILE!),
        new ApiClient()
    )
    try {
        
    await loteSerieShipping.bulkShippingLoteSerie();
    } catch (error) {
    console.error(error)        
    }


})