import { type dataProdSectorErp } from "../interfaces/data-prod-sector-erp.ts";
import { type dataProdSectorShipping } from "../interfaces/data-prod-sector-shipping.ts";

export class   MappingProdSectorShipping {
     mappingToShipping( dataProdSectorErp:dataProdSectorErp ):dataProdSectorShipping{
        return { 
            estoque: Number(dataProdSectorErp.ESTOQUE),
            local1_produto: String(dataProdSectorErp.LOCAL1_PRODUTO),
            local2_produto: String(dataProdSectorErp.LOCAL2_PRODUTO),
            local3_produto: String(dataProdSectorErp.LOCAL3_PRODUTO),
            local4_produto: String(dataProdSectorErp.LOCAL4_PRODUTO),
            produto: Number(dataProdSectorErp.PRODUTO),
            local_produto:'',
            setor:dataProdSectorErp.SETOR
        }
     }
}