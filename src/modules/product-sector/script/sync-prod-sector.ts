import { ProdSectorFactory } from "../services/prod-sector-factory.ts";


const prodSectorShippingService = ProdSectorFactory.createProdSectorShippingService();

    try {
    
        await prodSectorShippingService.bulkShippingProdSector();

    } catch (error) {
            console.log(error)
    }
