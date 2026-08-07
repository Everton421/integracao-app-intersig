import dbConn from "../../../database/connection/database-connection.ts";
import { type EventRequirement } from "../contracts/event-requirement.ts";
import { RequirementDataAcess } from "../requirement-data-acess.ts";
import { ProcessStockErp } from "../services/process-stock-erp.service.ts";

export class ReceiveRequirementSubmitted {

        /**
         * Função para receber os requerimento efetuado, cria os movimentos no sistema e movimenta o estoque dos produtos e das series.
         * @param event evento ou dados do requerimento vindo da request da api.
         * @returns 
         */
    static async receive(event: EventRequirement) // : Promise<{ success: boolean; message: string | null }> 
    {
        let resultFunction = { success: false, message: null } as { success: boolean; message: string | null };
         
        const connection = await dbConn.getConnection();

        try {

            await connection.beginTransaction();

            const  resultVerifyRequirementSubmited   = await RequirementDataAcess.findRequirementSubmitedByCodeMobile(event.codigo) 

            if (resultVerifyRequirementSubmited.length > 0) {
                console.log(`[V] Efetuando requerimento no sistema ${event.codigo} ...`);

                const { codigo, ...dataRequirementRequest } = event;

                // dados do requerimento registrado na tabela requerimentos enviados.
                const dataRequirementSubmitedIntegration = resultVerifyRequirementSubmited[0];

                // consulta os dados do requerimento no erp.
                const dataRequerimentErp = await  RequirementDataAcess.findRequirementErpByCode(dataRequirementSubmitedIntegration.codigo_sistema);
                if(dataRequerimentErp.length > 0 ){
                    console.log(`[V] Requerimento codigo: ${dataRequirementSubmitedIntegration.codigo_sistema} encontrado no sistema.`)

                     if ( dataRequerimentErp[0].SITUACAO == 'A' && dataRequirementRequest.situacao == 'E') {
                            console.log(`[V] Efetuando requerimento  ${dataRequirementSubmitedIntegration.codigo_sistema}  no sistema.`)
                        
                            await RequirementDataAcess.updateRequirement(dataRequirementRequest, dataRequirementSubmitedIntegration.codigo_sistema);

                        
                                for( const itenRequiriment of dataRequirementRequest.itens ){
                                        const { produto , quantidade } = itenRequiriment;
                                        const  { setor_destino , setor_origem } = dataRequirementRequest;
                                        // processa os produtos nos setores
                                        await ProcessStockErp.updateStockProductSectorsErp( produto, setor_origem, setor_destino, quantidade );
                                    
                                     for( const serieReq of itenRequiriment.lotes_series ){
                                        // processa os lote series do produto vindo do requerimento 
                                        await ProcessStockErp.updateStockLoteSeriesSectors(produto , serieReq.lote_serie, setor_origem, setor_destino, serieReq.quantidade   )
                                    }
                              }

                        resultFunction.success = true;
                        return resultFunction;
                    }else{
                     console.log(`[V] Requerimento codigo: ${dataRequirementSubmitedIntegration.codigo_sistema} com situação diferente da esperada, situação [ERP] ${dataRequerimentErp[0].SITUACAO} situacao [MOBILE] ${dataRequirementRequest.situacao}.`)

                    }
                }
              
                } else {
                    resultFunction.message = `[X] Requerimento ${event.codigo} não foi encontrado na tabela de requerimentos enviados.`;
                    resultFunction.success = false;
                }


            await connection.commit();

        } catch (e) {
            await connection.rollback();

            console.log(`[X] Ocorreu um erro ao tentar processar requerimento ${event.codigo}`, e);
            resultFunction.message = `[X] Erro ao processar requerimento ${event.codigo}.`;

        } finally {
            connection.release();
            return resultFunction;
        }
         
    }
}

   