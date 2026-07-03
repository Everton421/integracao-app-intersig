import { seed } from "./database/seed/seed.ts";
import { insertMvto_produtos } from "./modules/product-movment/repository-movimentos.ts";
import { updateProdSetor } from "./modules/product-sector/repository-prod-setor.ts";
import { consumerMobile } from "./services/consumer-mobile.ts";
import { consumer_sistema } from "./services/consumer-sistema.ts";
import { updateOrderSeparacao } from "./services/service-receive-order.ts";
 

await consumer_sistema();
     await seed()

     await consumerMobile('pedido.separado', updateOrderSeparacao, true );
     
     await consumerMobile('produtosetor.atualizado',updateProdSetor, true ) 
   //  await consumerMobile('movimentosprodutos.inserido',insertMvto_produtos, true ) 