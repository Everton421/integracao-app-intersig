import { RepositoryLoteSerieSetor } from "../../lote-serie-setor/repository-lote-series-setor.ts";
import { ProdSetorRepository } from "../../product-sector/repository-prod-setor.ts";


/**
 * Efetua a transferencia de estoque dos produtos e series entre os setores
 */
export class ProcessStockErp {
        /**
         *  Efetua a transferencia de estoque dos produtos 
         * @param product produto a ser atualizado nos setores de origem e destino
         * @param originSector codigo do setor de origem
         * @param destinationSector codigo do setor de destino
         * @param quantity quantidade a ser ajustada no setor
         */
        static async updateStockProductSectorsErp(product:number, originSector:number, destinationSector:number, quantity:number ){
                let dataResultFunction = { success: false, message: '', data: null }

                try{
                        // dados do produto no setor de destino
                    const dataCurrentStockAtDestinationSector =  await ProdSetorRepository.findStockByProductAndSector(product, destinationSector);
                        
                        // saldo estoque setor destino 
                    const currentStockAtDestinationSector = dataCurrentStockAtDestinationSector.length > 0 ? Number(dataCurrentStockAtDestinationSector[0].ESTOQUE) : 0;
                    const newStockForDestinationSector = currentStockAtDestinationSector + quantity;
                        console.log(`Atualizando produto:${product} no setor de destino ${destinationSector}, saldo atual :${currentStockAtDestinationSector}  novo saldo: ${newStockForDestinationSector}`)
                     await ProdSetorRepository.updateStockBySectorAndProduct( product, destinationSector, newStockForDestinationSector)

                        // dados do produto no setor de origem
                    const dataCurrentStockAtOriginSector =  await ProdSetorRepository.findStockByProductAndSector(product, originSector);
                    
                        // saldo estoque setor origem 
                    const currentStockAtOriginSector = dataCurrentStockAtOriginSector.length > 0 ? Number(dataCurrentStockAtOriginSector[0].ESTOQUE) : 0;
                    const newStockForSourceSector = currentStockAtOriginSector -  quantity;
                  console.log(`Atualizando produto:${product} no setor de origem ${originSector}, saldo atual :${currentStockAtOriginSector}  novo saldo: ${newStockForSourceSector}`)
                 await ProdSetorRepository.updateStockBySectorAndProduct( product, originSector, newStockForSourceSector)

                    
                       dataResultFunction.success = true
                    dataResultFunction.message = `[V]  atualizado saldo do produto ${product} nos setores ${originSector} e ${destinationSector}.`

                }catch(e:any){
                       dataResultFunction.success = false
                    dataResultFunction.message = `[X] Erro ao tentar atualizar estoque do produto ${product} nos setores ${originSector} e ${destinationSector}. ${e}`
          
                }finally{
                    return dataResultFunction

                }
        }


            /**
             * 
             * @param product produto a ser atualizado nos setores de origem e destino
             * @param codeSerie codigo da serie a ser atualizada no setor 
             * @param originSector codigo do setor de origem
             * @param destinationSector codigo do setor de destino
             * @param quantity quantidade a ser ajustada no setor
             */
        static async updateStockLoteSeriesSectors(product :number, codeSerie:number, originSector:number, destinationSector: number , quantity:number){

                let dataResultFunction = { success: false, message: '', data: null }
                try{

                        // dados da serie no setor de origem
                    const stockOriginSector = await RepositoryLoteSerieSetor.findStockSeriesByProductAndSector(product, codeSerie , originSector);

                    //    saldo da serie no setor de origem  
                    const currentStockSeriesAtSourceSector = stockOriginSector.length > 0 ? Number(stockOriginSector[0].ESTOQUE) : 0;
                    // novo saldo da serie no setor de origem
                    const newStockSeriesForSourceSector = currentStockSeriesAtSourceSector - quantity;

                        /// executar update dos saldos das series no setor de origem 
                    await RepositoryLoteSerieSetor.updateLoteSerieSetor( originSector, product, codeSerie, newStockSeriesForSourceSector)


                    // consultando saldo das serie no setor de destino
                    const dataCurrentStockSeriesAtDestinationSector = await RepositoryLoteSerieSetor.findStockSeriesByProductAndSector(product, codeSerie, destinationSector);

                    // *********** saldo da serie no setor de destino ***********
                    const currentStockSeriesAtDestinationSector = dataCurrentStockSeriesAtDestinationSector.length > 0 ? Number(dataCurrentStockSeriesAtDestinationSector[0].ESTOQUE) : 0;
                    const newStockSeriesForDestinationSector = currentStockSeriesAtDestinationSector + quantity;
                        
                    /// executar update dos saldos das series no setor de destino 
                    await RepositoryLoteSerieSetor.updateLoteSerieSetor( destinationSector, product, codeSerie, newStockSeriesForDestinationSector)
                   
                     dataResultFunction.success = true
                    dataResultFunction.message = `[V]  atualizado saldo do lote serie ${codeSerie} do produto ${product} nos setores ${originSector} e ${destinationSector}.`

                }catch(e){
                    dataResultFunction.success = false
                    dataResultFunction.message = `[X] Erro ao tentar atualizar estoque do lote serie ${codeSerie} do produto ${product} nos setores ${originSector} e ${destinationSector}. ${e}`
                } finally{
                    return dataResultFunction
                }

            } 

     
}   