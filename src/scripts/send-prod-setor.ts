import { getAllProdSetor } from "../modules/product-sector/repository-prod-setor.ts";
import { serviceSendProdSetor } from "../modules/product-sector/service-send-prod-setor.ts";

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