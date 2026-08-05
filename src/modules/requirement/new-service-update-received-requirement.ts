import { type ResultSetHeader } from "mysql2";
import { type table_enviados } from "../../contracts/table-enviados.ts";
import dbConn, { ESTOQUE, MOBILE, VENDAS } from "../../database/connection/database-connection.ts";
import { RepositoryLoteSerieSetor } from "../lote-serie-setor/repository-lote-series-setor.ts";
import { type prod_setor } from "../product-sector/contracts/prod_setor.ts";
import { ProdSetorRepository } from "../product-sector/repository-prod-setor.ts";
import { type erpRequeriment } from "./contracts/erpRequirement.ts";
import { type EventRequirement } from "./contracts/event-requirement.ts";
import { RequirementRepository } from "./repository-requirement.ts";

export class NewUpdateReceivedRequirementService {

        /**
         * Função para receber os requerimento efetuado, cria os movimentos no sistema e movimenta o estoque dos produtos e das series.
         * @param event evento ou dados do requerimento vindo da request da api.
         * @returns 
         */
    static async receive(event: EventRequirement) // : Promise<{ success: boolean; message: string | null }> 
    {
        let resultFunction = { success: false, message: null } as { success: boolean; message: string | null };
        console.log(JSON.stringify(event))
         
         
        const connection = await dbConn.getConnection();

        try {

            await connection.beginTransaction();

            const sqlVerify = `SELECT * FROM ${MOBILE}.requerimentos WHERE id_mobile = ?;`;
            const [resultVerifyRequirementSubmited] = await dbConn.query(sqlVerify, [event.codigo]);
            const arrVerifyRequirementSubmited = resultVerifyRequirementSubmited as table_enviados[];

            if (arrVerifyRequirementSubmited.length > 0) {
                console.log(`[V] Atualizando requerimento ${event.codigo} ...`);

                const { codigo, ...dataRequirementRequest } = event;
                const codigoRequirement = codigo;
                const productsRequirement = event.itens;

                // dados do requerimento registrado na tabela requerimentos enviados.
                const dataRequirementSubmitedIntegration = arrVerifyRequirementSubmited[0];


                // consulta os dados do requerimento no erp.
                const [arrDataRequerimentErp] = await await dbConn.query(`SELECT * FROM ${VENDAS}.requerimentos WHERE CODIGO = ? `, [dataRequirementSubmitedIntegration.codigo_sistema]);
                const dataRequerimentErp = arrDataRequerimentErp as erpRequeriment[];

                if (dataRequerimentErp.length > 0) {

                    // Atualizando requerimento no sistema ...
                    const resultUpdateRequirement = await RequirementRepository.updateRequirement(dataRequirementRequest, codigoRequirement)

                    if (resultUpdateRequirement.affectedRows) {
                        //exclui os produtos do requerimento 
                        const resultDeleteItensRequeriment = await RequirementRepository.deleteItensRequeriment(codigoRequirement);
                        //insere os produtos do requerimento 
                        const resultInsertItensRequeriment = await RequirementRepository.insertItensRequerimento(codigoRequirement, event.itens);

                        // exclui os lotes e series do requerimento
                        const resultDeleteLotesSeriesRequerimento = await RequirementRepository.deleteLotesSeriesRequerimento(codigoRequirement);
                        // insere os novos lotes e series no requerimento
                        for (const productRequiment of productsRequirement) {
                            const resultInsertLotesSeriesRequerimento = await RequirementRepository.insertLotesSeriesRequerimento(codigoRequirement, productRequiment.produto, productRequiment.lotes_series);
                        }

                        if (dataRequirementRequest.situacao == 'E') {

                            await RequirementRepository.insertInternalMovementErp(codigoRequirement, dataRequirementRequest)

                            await ProcessStockProduct.execute(dataRequirementRequest);
                        }

                        console.log(`[V] Requerimento ${event.codigo} atualizado com sucesso.`);
                        resultFunction.success = true;
                        return resultFunction;
                    }
                } else {
                    resultFunction.message = `[X] Requerimento ${event.codigo} registrado na tabela de requerimentos enviados, porém nao existe no sitema.`;
                    console.log(resultFunction.message);
                    resultFunction.success = false;
                }

            } else {

                const codigoSistema = await RequirementRepository.insertRequirement(event);

                if (codigoSistema > 0) {
                    const sqlInsertMobile = `INSERT INTO ${MOBILE}.requerimentos SET id_mobile = ?, codigo_sistema = ?;`;
                    const [resultInsertMobile] = await dbConn.query(sqlInsertMobile, [event.codigo, codigoSistema]) as ResultSetHeader[];

                    if (resultInsertMobile.insertId > 0) {
                        console.log(`[V] Requerimento ${event.codigo} registrado no sistema com código ${codigoSistema}.`);
                        resultFunction.success = true;
                    } else {
                        resultFunction.message = `[X] Requerimento ${event.codigo} inserido no ERP mas falhou ao registrar na tabela de mapeamento.`;
                    }
                } else {
                    resultFunction.message = `[X] Falha ao inserir requerimento ${event.codigo} no ERP.`;
                }
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

class ProcessStockProduct {
        /**
         * 
         * @param product produto a ser atualizado nos setores de origem e destino
         * @param originSector codigo do setor de origem
         * @param destinationSector codigo do setor de destino
         * @param quantity quantidade a ser ajustada no setor
         */
        static async updateStockProductSectors(product:number, originSector:number, destinationSector:number, quantity:number ){
                try{
                        // dados do produto no setor de destino
                    const dataCurrentStockAtDestinationSector =  await ProdSetorRepository.findStockByProductAndSector(product, destinationSector);
                    
                        // saldo estoque setor destino 
                    const currentStockAtDestinationSector = dataCurrentStockAtDestinationSector.length > 0 ? Number(dataCurrentStockAtDestinationSector[0].ESTOQUE) : 0;
                    const newStockForDestinationSector = currentStockAtDestinationSector + quantity;

                    const resultUpdateProdSetorDestinationSector = await ProdSetorRepository.updateStockBySectorAndProduct( product, destinationSector, newStockForDestinationSector)


                        // dados do produto no setor de origem
                    const dataCurrentStockAtOriginSector =  await ProdSetorRepository.findStockByProductAndSector(product, originSector);
                    
                        // saldo estoque setor origem 
                    const currentStockAtOriginSector = dataCurrentStockAtOriginSector.length > 0 ? Number(dataCurrentStockAtDestinationSector[0].ESTOQUE) : 0;
                    const newStockForSourceSector = currentStockAtOriginSector -  quantity;
                    const resultUpdateStockForSourceSector = await ProdSetorRepository.updateStockBySectorAndProduct( product, destinationSector, newStockForSourceSector)

                }catch(e:any){
                    console.log(`[V] Erro ao tantar atualizar saldo de estoque do produto ${product} no setores ${originSector} e ${destinationSector}  ${e}`);
                }

        }

        static async updateStockLoteSeriesSectors(product :number, serie:number, originSector:number, destinationSector: number , quantity:number){

                    // dados da serie no setor de origem
                const stockOriginSector = await RepositoryLoteSerieSetor.findStockSeriesByProductAndSector(product, serie , originSector);

                   //    saldo da serie no setor de origem  
                const currentStockSeriesAtSourceSector = stockOriginSector.length > 0 ? Number(stockOriginSector[0].ESTOQUE) : 0;
                // novo saldo da serie no setor de origem
                const newStockSeriesForSourceSector = currentStockSeriesAtSourceSector - quantity;




                // consultando saldo das serie no setor de destino
                const dataCurrentStockSeriesAtDestinationSector = await RepositoryLoteSerieSetor.findStockSeriesByProductAndSector(product, serie, destinationSector);

                // *********** saldo da serie no setor de destino ***********
                const currentStockSeriesAtDestinationSector = dataCurrentStockSeriesAtDestinationSector.length > 0 ? Number(dataCurrentStockSeriesAtDestinationSector[0].ESTOQUE) : 0;
                const newStockSeriesForDestinationSector = currentStockSeriesAtDestinationSector + quantity;

            
                    

        } 

    /**
     *  Movimenta o estoque dos produtos e das series entre os setores.
     * @param dataRequirementRequest 
     */
    static async execute(dataRequirementRequest: Omit<EventRequirement, 'codigo'>) {
        const productsRequirement = dataRequirementRequest.itens;

        for (const productRequiment of productsRequirement) {
            const sqlStock = `SELECT * FROM  ${ESTOQUE}.prod_setor WHERE PRODUTO = ? AND SETOR = ? `;

            // saldo do setor de destino   
            const [arrCurrentStockAtDestinationSector] = await dbConn.query(sqlStock, [productRequiment.produto, dataRequirementRequest.setor_destino]);
            const dataCurrentStockAtDestinationSector = arrCurrentStockAtDestinationSector as prod_setor[]
            const currentStockAtDestinationSector = dataCurrentStockAtDestinationSector.length > 0 ? Number(dataCurrentStockAtDestinationSector[0].ESTOQUE) : 0;

            // novo saldo para setor de destino.
            const newStockForDestinationSector = currentStockAtDestinationSector + productRequiment.quantidade;
            /// atualizar setor de destino
            const resultUpdateProdSetorDestinationSector = await ProdSetorRepository.updateStockBySectorAndProduct(productRequiment.produto, dataRequirementRequest.setor_destino, newStockForDestinationSector)


            // saldo do setor de origem   
            const [arrCurrentStockAtSourceSector] = await dbConn.query(sqlStock, [productRequiment.produto, dataRequirementRequest.setor_origem]);
            const dataCurrentStockAtSourceSector = arrCurrentStockAtSourceSector as prod_setor[]

            const currentStockAtSourceSector = dataCurrentStockAtSourceSector.length > 0 ? Number(dataCurrentStockAtSourceSector[0].ESTOQUE) : 0;
            const newStockForSourceSector = currentStockAtSourceSector - productRequiment.quantidade;
            await ProdSetorRepository.updateStockBySectorAndProduct(productRequiment.produto, dataRequirementRequest.setor_origem, newStockForSourceSector)

            for (const serie of productRequiment.lotes_series) {
                // consultar estoque lote serie do requerimento 

                // consultando saldo das serie no setor de origem
                const dataCurrentStockSeriesAtSourceSector = await RepositoryLoteSerieSetor.findStockSeriesByProductAndSector(productRequiment.produto, serie.lote_serie, dataRequirementRequest.setor_origem);

                // ***********  saldo da serie no setor de origem *********** 
                const currentStockSeriesAtSourceSector = dataCurrentStockSeriesAtSourceSector.length > 0 ? Number(dataCurrentStockSeriesAtSourceSector[0].ESTOQUE) : 0;
                const newStockSeriesForSourceSector = currentStockSeriesAtSourceSector - serie.quantidade;

                // *** executa a query no setor de origem
                await RepositoryLoteSerieSetor.updateLoteSerieSetor(dataRequirementRequest.setor_origem, productRequiment.produto, serie.lote_serie, newStockSeriesForSourceSector);


                // consultando saldo das serie no setor de destino
                const dataCurrentStockSeriesAtDestinationSector = await RepositoryLoteSerieSetor.findStockSeriesByProductAndSector(productRequiment.produto, serie.lote_serie, dataRequirementRequest.setor_destino);

                // *********** saldo da serie no setor de destino ***********
                const currentStockSeriesAtDestinationSector = dataCurrentStockSeriesAtDestinationSector.length > 0 ? Number(dataCurrentStockSeriesAtDestinationSector[0].ESTOQUE) : 0;
                const newStockSeriesForDestinationSector = currentStockSeriesAtDestinationSector + serie.quantidade;

                // *** executa a query no setor de destino
                await RepositoryLoteSerieSetor.updateLoteSerieSetor(dataRequirementRequest.setor_destino, productRequiment.produto, serie.lote_serie, newStockSeriesForDestinationSector);

            }
        }

    }
}   