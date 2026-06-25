import { insertMvto_produtos } from "../modules/product-movment/repository-movimentos.ts";
import { updateProdSetor } from "../modules/product-sector/repository-prod-setor.ts";
import { consumerMobile } from "../services/consumer-mobile.ts";
import { updateOrder } from "../services/service-receive-order.ts";

    async function jobConsumerMobile( ) {
     await consumerMobile('pedido.atualizado', updateOrder, true );
     await consumerMobile('produtosetor.atualizado',updateProdSetor, true ) 
     await consumerMobile('movimentosprodutos.inserido',insertMvto_produtos, true ) 
    }


    await jobConsumerMobile();