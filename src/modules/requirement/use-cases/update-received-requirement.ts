import { type table_enviados } from "../../../contracts/table-enviados.ts";
import dbConn, { MOBILE, VENDAS } from "../../../database/connection/database-connection.ts";
import { type erpRequeriment } from "../contracts/erpRequirement.ts";
import { type EventRequirement } from "../contracts/event-requirement.ts";
import { RequirementDataAcess } from "../requirement-data-acess.ts";
import { ProcessStockErp } from "../services/process-stock-erp.service.ts";
import { UpdateRequirementErpService } from "../services/update-requirement-erp.service.ts";

export class UpdateReceivedRequirementService {

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

            const sqlVerify = `SELECT * FROM ${MOBILE}.requerimentos WHERE id_mobile = ?;`;
            const [resultVerifyRequirementSubmited] = await dbConn.query(sqlVerify, [event.codigo]);
            const arrVerifyRequirementSubmited = resultVerifyRequirementSubmited as table_enviados[];

            if (arrVerifyRequirementSubmited.length > 0) {
                console.log(`[V] Atualizando requerimento ${event.codigo} ...`);

                const { codigo, ...dataRequirementRequest } = event;

                // dados do requerimento registrado na tabela requerimentos enviados.
                const dataRequirementSubmitedIntegration = arrVerifyRequirementSubmited[0];


                // consulta os dados do requerimento no erp.
                const [arrDataRequerimentErp] = await await dbConn.query(`SELECT * FROM ${VENDAS}.requerimentos WHERE CODIGO = ? `, [dataRequirementSubmitedIntegration.codigo_sistema]);
                const dataRequerimentErp = arrDataRequerimentErp as erpRequeriment[];
                
              
                if (dataRequerimentErp.length > 0) {

                    // CODIGO:codigo do requerimento no sistema 
                    // SITUACAO: situacao do requerimento no sistema
                     const { CODIGO, SITUACAO } =dataRequerimentErp[0];

                    // Atualizando requerimento no sistema ...
                      const resultUpdateRequirement = await UpdateRequirementErpService.execute( event, CODIGO)

                    if (resultUpdateRequirement.data > 0 ) {

                        // se a sitaução do requerimento no sistemafor A e no mobile for E,  é executado a transferencia entre os setores
                        if (dataRequirementRequest.situacao == 'E' && SITUACAO == 'A') {

                            // registra o movimento interno no erp
                            await RequirementDataAcess.insertInternalMovementErp(CODIGO, dataRequirementRequest)
                            // executa os movimentos entre os setores do erp
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
                        }

                        console.log(`[V] Requerimento ${event.codigo} atualizado com sucesso.`);
                        resultFunction.success = true;
                        return resultFunction;
                    }

                    
                } else {
                    resultFunction.message = `[X] Requerimento [MOBILE] ${event.codigo} registrado na tabela de requerimentos enviados, porém nao existe no sitema.`;
                    console.log(resultFunction.message);
                    resultFunction.success = false;
                }

            } else {
                     resultFunction.message = `[X] Requerimento [MOBILE] ${event.codigo} não foi registrado na tabela de requerimentos enviados.`;
                    console.log(resultFunction.message);
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

 