import { seed } from "./database/seed/seed.ts";
import { ReceiveLoteSerieSetor } from "./modules/lote-serie-setor/service-receive-lote-serie-setor.ts";
import { ReceiveLoteSerieService } from "./modules/lotes-series/service-receive-lote-serie.ts";
import { insertMvto_produtos } from "./modules/product-movment/repository-movimentos.ts";
import { ProdSetorRepository } from "./modules/product-sector/repository-prod-setor.ts";
import { UpdateSalesOrderSeparation } from "./modules/sales-order/service-receive-sales-order-separation.ts";
import { consumerMobile } from "./services/consumer-mobile.ts";
import { consumer_sistema } from "./services/consumer-sistema.ts";

await consumer_sistema();

      await seed()

      await consumerMobile('pedido.separado', UpdateSalesOrderSeparation.updateErpOrder, true );
     
      await consumerMobile('produtosetor.atualizado', ProdSetorRepository.updateProdSetor , true ) 

       await consumerMobile('movimentosprodutos.inserido',insertMvto_produtos, true ) 
   
       await consumerMobile('lotesserie.inserido', ReceiveLoteSerieService.receiveByEvent , true ) 
 
       await consumerMobile('loteseriesetor.atualizado', ReceiveLoteSerieSetor.receive, true ) 

   