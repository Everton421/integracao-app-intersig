import { LoteSerieSectorFactory } from "../services/lote-serie-sector-factory.ts";

    const service = LoteSerieSectorFactory.createLoteSerieShopping();
    
    await service.bulkSyncLoteSerieSector();
