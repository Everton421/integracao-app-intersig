import test from "node:test";
import { LoteSerieSectorFactory } from "../services/lote-serie-sector-factory.ts";


test(" shipping-lote-serie-setor ", async (t) => {

    const service = LoteSerieSectorFactory.createLoteSerieShopping();
    
    await service.bulkSyncLoteSerieSector();

})