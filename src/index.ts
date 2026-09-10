import { type LoteSerieSetorInput, ReceiveLoteSerieSetor } from "./modules/lote-serie-setor/service-receive-lote-serie-setor.ts";
import { type EventLoteSerie } from "./modules/lotes-series/contracts/event-lote-serie.ts";
import { ReceiveLoteSerieService } from "./modules/lotes-series/service-receive-lote-serie.ts";
import { type message_movimento_produtos } from "./modules/product-movment/contracts/message-movimentos-produtos.ts";
import { insertMvto_produtos } from "./modules/product-movment/repository-movimentos.ts";
import { type MessageSeparationOrder } from "./modules/sales-order/contracts/message-separation-order.ts";
import { UpdateSalesOrderSeparation } from "./modules/sales-order/service-receive-sales-order-separation.ts";
import express, { type Request } from 'express';
import { consumerMobile } from "./services/consumer-mobile.ts";
import { consumer_sistema } from "./services/consumer-sistema.ts";
import { ReceiveRequirement } from "./modules/requirement/use-cases/receive-requirement.ts";
import { ReceiveRequirementSubmitted } from "./modules/requirement/use-cases/receive-requirement-submitted.ts";

import path from 'node:path';
import { ProductShippingService } from "./modules/products/services/product-shipping-service.ts";
import { MappingProductShipping } from "./modules/products/mapping/mapping-product-shipping.ts";
import { ProductDataAcess } from "./modules/products/data-acess/product-data-acess.ts";
import dbConn, { ESTOQUE, MOBILE, PUBLICO } from "./database/connection/database-connection.ts";
import { ApiClient } from "./services/api-client.ts";
import { ProdSectorShippingService } from "./modules/product-sector/services/prod-sector-shipping-service.ts";
import { MappingProdSectorShipping } from "./modules/product-sector/mapping/mapping-prod-sector-shipping.ts";
import { ProdSectorDataAcess } from "./modules/product-sector/data-acess/prod-sector-data-acess.ts";
import { ReceiveProdSector } from "./modules/product-sector/services/receive-prod-sector-service.ts";
import { type message_prod_setor } from "./modules/product-sector/interfaces/message-prod-setor.ts";
import {type ResultSetHeader } from "mysql2";
import { seed } from "./database/seed/seed.ts";
 


type metadataRequest = {
      tenant_id: string,
      event: string,
      timestamp: string,
      origin: string
}

 const port = process.env.PORT_INTEGRATION || 5000;



const mappingProductShipping = new MappingProductShipping();
const productDataAcess = new ProductDataAcess(dbConn);
const apiClient = new ApiClient();

const productShippingService = new ProductShippingService(
      mappingProductShipping,
       productDataAcess,
      String(PUBLICO),
      String(MOBILE),
      apiClient
);


      const prodSectorDataAcess = new ProdSectorDataAcess(dbConn);
      const mappingProdSectorShipping = new MappingProdSectorShipping();
      const prodSectorShippingService = new  ProdSectorShippingService( 
                        prodSectorDataAcess,
                        productShippingService,
                        productDataAcess,
                        String(ESTOQUE),
                        String(MOBILE),
                        mappingProdSectorShipping,
                        apiClient
                  )


   const receiveProdSector = new ReceiveProdSector( prodSectorDataAcess, String(ESTOQUE)  );

  // consumer sistema   
    await consumer_sistema( productShippingService , prodSectorShippingService);
/* 

//consumer mobile    
await consumerMobile('produtosetor.atualizado', receiveProdSector.recebiveByEvent, true)

await consumerMobile('pedido.separado', UpdateSalesOrderSeparation.updateErpOrder, true)

await consumerMobile('movimentosprodutos.inserido', insertMvto_produtos, true)

await consumerMobile('lotesserie.inserido', ReceiveLoteSerieService.receiveByEvent, true);

await consumerMobile('loteseriesetor.atualizado', ReceiveLoteSerieSetor.receive , true);

await consumerMobile('requerimento.inserido', ReceiveRequirement.receive , true);

await consumerMobile('requerimento.efetuado', ReceiveRequirementSubmitted.receive , false);

// await consumerMobile('requerimento.atualizado', UpdateReceivedRequirementService.receive , false);


*/
//****************************** /
//       EXPRESS
//****************************** /

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(import.meta.dirname, 'web', 'views'));


app.post("/webhook", async (req: Request, res) => {
      const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

      const metadata = req.body.metadata as metadataRequest;

      console.log(`[WEBHOOK] Recebido mensagem ${metadata.event}...`)
      if (metadata.origin == origin) {
            console.log(`[WEBHOOK] Mensagem ${metadata.event} não será processada.`)
            return
      }


      if (metadata.event == 'pedido.separado') {
            const data = req.body.data as MessageSeparationOrder;
            await UpdateSalesOrderSeparation.updateErpOrderSeparation(data);
      }

      if (metadata.event == 'produtosetor.atualizado') {
            const data = req.body.data as message_prod_setor;
            await receiveProdSector.recebiveByEvent(data);
      }
      if (metadata.event == 'movimentosprodutos.inserido') {
            const data = req.body.data as message_movimento_produtos;
            await insertMvto_produtos(data)
      }

      if (metadata.event == 'lotesserie.inserido') {
            const data = req.body.data as EventLoteSerie;

            await ReceiveLoteSerieService.receiveByEvent(data);
      }
      if (metadata.event == 'loteseriesetor.atualizado') {
            const data = req.body.data as LoteSerieSetorInput;
            await ReceiveLoteSerieSetor.receive(data);
      }
      return res.status(200).json({ ok: true })
})

app.get("/webhook/health", (req, res)=>{
      return res.status(200).json({ok: true })
})

app.get('/', async (req, res ) =>{
       
      type config ={
             id: number,
             num_fabricante: string
            num_original:string
            sku:string
      }
          const sql=`SELECT * FROM ${MOBILE}.mapeamento_produtos  WHERE ID = 1;`;
                       const [resultVerifyProduct] = await dbConn.query(sql) ;
                       
                       const dataConfig = resultVerifyProduct as config[];
                        const options  = [ 'num_fabricante', 'sku', 'outro_cod2', 'num_original']
                      
      res.render('index', { dataConfig:dataConfig[0], options })
});


app.post('/ajusteConfig', async ( req, res )=>{
            const num_fabricante= req.body.num_fabricante;
            const num_original= req.body.num_original;
            const sku= req.body.sku;
      const sqlUpdate = ` UPDATE ${MOBILE}.mapeamento_produtos set num_fabricante = ?, num_original = ?, sku = ? `
      const values = [ num_fabricante, num_original, sku  ];
                       const [resultVerifyProduct] = await dbConn.query(sqlUpdate,values) ;
          const dataResultVerifyProduct = resultVerifyProduct as ResultSetHeader;

          if(dataResultVerifyProduct.affectedRows > 0 ){
            res.redirect('/')
          }
        })

app.get('/produtos', (req, res ) =>{
      res.render('produtos')
})


app.listen(port, () => {
      console.log(`Server is running port: ${port}! `)
})
await seed()