import { getBrand } from "../modules/brands/repository-brand.ts";
import { serviceSendBrands } from "../modules/brands/service-sync-brands-.ts";
import { getCategory } from "../modules/category/repository-category.ts";
import { ServiceSyncCategories } from "../modules/category/service-sync-categories.ts";
import { getAllClients } from "../modules/customer/repository-client.ts";
import { ServiceSyncCustomers } from "../modules/customer/service-sync-customers.ts";
import { getAllProdSetor } from "../modules/product-sector/repository-prod-setor.ts";
import { serviceSendProdSetor } from "../modules/product-sector/service-send-prod-setor.ts";
import { getProduct } from "../modules/products/repository-produto.ts";
import { serviceSendProduct } from "../modules/products/service-send-product.ts";
import { serviceSendPurchaseOrder } from "../modules/purchase-order/service-send-purchase-order.ts";
import { selectOrdemCompraSistema, selectPedidoSistema } from "../modules/sales-order/repository-pedido.ts";
import { serviceSendOrder } from "../modules/sales-order/service-sync-sales-orders.ts";
import { getSetores } from "../modules/sector/repository-setor.ts";
import { serviceSendSetor } from "../modules/sector/service-send-setor.ts";


async function jobSendData(){
    const dataProd = await getProduct();
        if(dataProd.length >  0 ){
            for( const i of dataProd ){
                await serviceSendProduct({
                    criado_em: i.data_cadastro,
                    dados_json: String(i),
                    id:  0 ,
                    id_evento:  0 ,
                    id_message: '0',
                    id_registro: i.codigo,
                    setor: 0,
                    status: 'PROCESSADO',
                    tabela:  0 ,
                    tabela_origem: 'cad_prod',
                    tipo_evento: 'UPDATE'
                     
                })
            }
        }

            const dataClient = await getAllClients();
            for( const i of dataClient ){
                await ServiceSyncCustomers.syncData({ 
                    criado_em: i.DATA_CADASTRO,
                    dados_json: String(i),
                    id: 0,
                    id_evento: i.CODIGO,
                    id_message: '0',
                    id_registro: i.CODIGO,
                    setor:1,
                    status: 'PROCESSADO',
                    tabela: 0,
                    tabela_origem: 'cad_clie',
                    tipo_evento: 'UPDATE'
                }) 
            }

            const dataBrand = await getBrand();
            for( const i of dataBrand ){
                await serviceSendBrands({
                 criado_em: i.DATA_CADASTRO,
                    dados_json: String(i),
                    id: 0,
                    id_evento: i.CODIGO,
                    id_message: '0',
                    id_registro: i.CODIGO,
                    setor:1,
                    status: 'PROCESSADO',
                    tabela: 0,
                    tabela_origem: 'cad_pmar',
                    tipo_evento: 'UPDATE'
                }) 
            }
               
            const dataCategory = await getCategory();
            for(const i of dataCategory ){
                    await ServiceSyncCategories.syncData({
                         criado_em: i.DATA_CADASTRO,
                    dados_json: String(i),
                    id: 0,
                    id_evento: i.CODIGO,
                    id_message: '0',
                    id_registro: i.CODIGO,
                    setor:1,
                    status: 'PROCESSADO',
                    tabela: 0,
                    tabela_origem: 'cad_pgru',
                    tipo_evento: 'UPDATE'
                }) 
            }
 
     
           const dataSetores = await getSetores();
            for( const i of dataSetores){
                    await serviceSendSetor({
                    criado_em: i.DATA_CADASTRO,
                    dados_json: String(i),
                    id: 0,
                    id_evento: i.CODIGO,
                    id_message: '0',
                    id_registro: i.CODIGO,
                    setor:1,
                    status: 'PROCESSADO',
                    tabela: 0,
                    tabela_origem: 'setores',
                    tipo_evento: 'UPDATE'
                }) 
                }

         const dataProdSetor = await getAllProdSetor();
        if( dataProdSetor.length >  0 ){

            for(const i of dataProdSetor ){
                await serviceSendProdSetor({ 
                    criado_em: i.DATA_RECAD,
                    dados_json: String(i),
                    id:0,
                    id_evento:0,
                    id_message: '0',
                    id_registro: i.PRODUTO,
                    setor: i.SETOR,
                    status:'PROCESSADO',
                    tabela: 0,
                    tabela_origem:'prod_setor',
                    tipo_evento:'INSERT'
                })
            }
        } 
            
 
            const dataOrders = await selectPedidoSistema();
                if(dataOrders.length > 0  ){
                    for( const i of dataOrders ){
                      await serviceSendOrder({  
                            criado_em: i.DATA_RECAD,
                                dados_json: String(i),
                                id:0,
                                id_evento:0,
                                id_message: '0',
                                id_registro: i.CODIGO,
                                setor: 0,
                                status:'PROCESSADO',
                                tabela: 0,
                                tabela_origem:'cad_orca',
                                tipo_evento:'INSERT'
                            })
                    }

                }

      /*   const dataPurchaseOrders = await selectOrdemCompraSistema();
       if(dataPurchaseOrders.length > 0 ){
                for( const i of dataPurchaseOrders ){
                    await serviceSendPurchaseOrder({
                        criado_em: i.DATA_CADASTRO,
                        dados_json: String(i),
                        tipo_evento: "INSERT",
                        id:0,
                        id_evento:0,
                        id_message:'0',
                        id_registro: i.CODIGO,
                        setor:0,
                        status: "PROCESSADO",
                        tabela:0,
                        tabela_origem: 'pro_comp'
                    })
                }
        }
        */
            console.log("[X] fim do processo.") 
                return
        }

        await jobSendData();