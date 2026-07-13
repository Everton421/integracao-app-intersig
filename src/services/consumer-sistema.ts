import amqplib from 'amqplib';
import { type event } from "../contracts/event.ts";
import {    ServiceSyncbrand } from "../modules/brands/service-sync-brands-.ts";
import { ServiceSyncCategories } from "../modules/category/service-sync-categories.ts";
import { ServiceSyncCustomers } from "../modules/customer/service-sync-customers.ts";
 
import { serviceSendProdSetor } from "../modules/product-sector/service-send-prod-setor.ts";
import { serviceSendProduct } from "../modules/products/service-send-product.ts";
import { ServiceSyncService } from "../modules/service/service-sync-service.ts";
import { ServiceSyncSector } from "../modules/sector/service-sync-sector.ts";
import { ServiceSyncServiceType } from "../modules/service-type/service-sync-service-type.ts";
import { ServiceSyncSupplier } from '../modules/supplier/service-sync-supplier.ts';
 
import { SendLoteSerieSetor } from '../modules/lote-serie-setor/lote-serie-setor.ts';
import { ServiceSyncLotesSeries } from '../modules/lotes-series/service-sync-lotes-series.ts';
import { ServiceSendPurchaseOrder } from '../modules/purchase-order/service-send-purchase-order.ts';
import { ServiceSyncSalesOrder } from '../modules/sales-order/service-sync-sales-orders.ts';
import { delay } from '../utils/delay.ts';
import { retryAsync } from '../utils/retry.ts';


export async function consumer_sistema(): Promise<any> {



  const URL = process.env.BROKER_URL_SISTEMA;
  const EXCHANGE = process.env.EXCHANGE_NAME_SISTEMA;

  const conn = await amqplib.connect(URL!);
  const channel = await conn.createChannel();

  const QUEUE_NAME = process.env.QUEUE_NAME_SISTEMA

  if (!QUEUE_NAME || !EXCHANGE) {
    throw new Error("Verificar variaveis de ambiente do broker do sistema [ BASE_QUEUE_NAME,   EXCHANGE_NAME] ");
  }

  const uniqueQueueName = QUEUE_NAME

  await channel.assertExchange(EXCHANGE, 'fanout', { durable: true })
  const q = await channel.assertQueue(uniqueQueueName, { durable: true });

  await channel.bindQueue(q.queue, EXCHANGE, '');

  console.log(`[*] Worker sistema iniciado na fila [${uniqueQueueName} ] `);

    channel.prefetch(10);

  await channel.consume(q.queue, async (msg) => {
    if (msg) {
      try {

        let conteudo = JSON.parse(msg.content.toString());

        if (conteudo  ) {

          const data = conteudo as event;
          console.log(`[X] Mensagem recebida do sistema tabela origem ${data.tabela_origem}.`)
          switch (data.tabela_origem) {

            case 'lotes_series':
                const resultLoteSerie = await ServiceSyncLotesSeries.syncData(data)
                channel.ack(msg);
               break;

            case 'lote_serie_setor':
              await   SendLoteSerieSetor(data)
                channel.ack(msg);
               break;
            case 'cad_prod':
                const resultProduct =  await serviceSendProduct(data);
               //resultProduct.sucess ? channel.ack(msg)   : channel.nack(msg); 
                channel.ack(msg);
               break;
            case 'cad_serv':
              const resultServices = await ServiceSyncService.syncData(data);
               channel.ack(msg);
               break;
            case 'tipos_os':
              const resultSendTipoOs = await ServiceSyncServiceType.syncData(data);
               channel.ack(msg);
                break;
            case 'setores':
              const resultSendSetor = await ServiceSyncSector.syncData(data);
               channel.ack(msg);
                break;
            case 'prod_setor':
               const resultSendProdSetor = await serviceSendProdSetor(data);
                //resultSendProdSetor.sucess ? channel.ack(msg)   : channel.nack(msg); 
                channel.ack(msg);
                break;
            case 'cad_clie':
              const resultClient = await ServiceSyncCustomers.syncData(data);
               // resultClient.success ? channel.ack(msg) : channel.nack(msg); 
                channel.ack(msg);
               break;
            case 'cad_pgru':
              const resultCategory = await ServiceSyncCategories.syncData(data);
              //resultCategory.success ? channel.ack(msg) : channel.nack(msg); 
                channel.ack(msg);
              break;
            case 'cad_pmar':
              const resultBrand =  await ServiceSyncbrand.syncData(data)
              //resultBrand.sucess ?    channel.ack(msg)  : channel.nack(msg);
                channel.ack(msg);
              break;
              case 'cad_forn': 
                await ServiceSyncSupplier.syncData(data);
                channel.ack(msg);
              break;
            
              case 'cad_orca':
                try {
                  const resultOrder = await retryAsync(() => ServiceSyncSalesOrder.syncData(data));
                  console.log(`[V] Pedido de venda ${data.id_registro} processado com sucesso / ${resultOrder.message}`);
                  channel.ack(msg);
                } catch (error) {
                  console.log(`[X] Falha definitiva no pedido de venda ${data.id_registro} após 3 tentativas: ${error}`);
                  channel.ack(msg);
                }
               break;
               case 'cad_comp':
                try {
                  const resultPurchaseOrder = await retryAsync(() => ServiceSendPurchaseOrder.send(data));
                  console.log(`[V] Pedido de compra ${data.id_registro} processado com sucesso / ${resultPurchaseOrder.message}`);
                  channel.ack(msg);
                } catch (error) {
                  console.log(`[X] Falha definitiva no pedido de compra ${data.id_registro} após 3 tentativas: ${error}`);
                  channel.ack(msg);
                }
               break;
               
            default:
              console.log("[X] Mensagem recebida do sistema, porém nenhuma ação será executada.")
                channel.ack(msg);

          }

        } else {
          console.log("Menagem vazia: ", conteudo )
        }

      } catch (e) {
        console.log("[x] Erro ao processar a mensagem do broker do sistema: ", e)
      }
    }
  }, { noAck: false });

}
