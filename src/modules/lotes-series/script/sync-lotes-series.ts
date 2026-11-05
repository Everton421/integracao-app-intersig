import { LoteSerieSectorFactory } from "../../lote-serie-setor/services/lote-serie-sector-factory.ts";

    const loteSerieShipping = LoteSerieSectorFactory.createLoteSerieShopping();

try {

    await  loteSerieShipping.bulkSyncLoteSerieSector();
} catch (error) {
    
}