import { type event } from "../../contracts/event.ts";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { RequirementRepository } from "./repository-requirement.ts";
import { RequerimentMapping } from "./requeriment-mapping.ts";
import { RequirementRequest } from "./requirement-request.ts";

export class ServiceSyncRequeriment{
    static async syncDataByEvent(event: event){

            const { id_registro } = event;
            const [ verifyRequerimentToSend ] = await dbConn.query(`SELECT id_mobile FROM  ${MOBILE}.requerimentos where codigo_sistema = '${id_registro}'`);
            const isverifiedRequeriment = verifyRequerimentToSend as { id_mobile : number}[];
                   
                  if( isverifiedRequeriment.length > 0 ){
                      return await this.update(id_registro);
                    }else{
                      return await this.send(id_registro);
                    }
    }


    static async update( codeRequeriment: number ){
          try{
            
            const [ verifyRequerimentToSend ] = await dbConn.query(`SELECT id_mobile FROM  ${MOBILE}.requerimentos where codigo_sistema = '${codeRequeriment}';`);
            
                    const isverifiedRequeriment = verifyRequerimentToSend as { id_mobile : number}[];

                    if( isverifiedRequeriment.length > 0 ){
                                const { id_mobile } = isverifiedRequeriment[0];

                        const ErpRequirement  =  await RequirementRepository.findRequeriments({ codigo: codeRequeriment})
                    
                        const ErpProdRequer  = await RequirementRepository.findProductsRequeriment(codeRequeriment);

                        const loteSerieRequer =   await RequirementRepository.findLoteSeriesRequeriment(codeRequeriment);

                        const resultMapping =  RequerimentMapping.mapping(ErpRequirement[0], ErpProdRequer, loteSerieRequer)
                            
                        const request = new RequirementRequest();
                        delete resultMapping.codigo;

                       const resultRequest = await request.put(resultMapping, id_mobile);
                        return resultRequest 
                        
                    }else{
                        console.log(`[X] Requerimento ${codeRequeriment} ainda nao foi enviado.`)
                        return { success: false, message: `[X] Requerimento ${codeRequeriment} ainda nao foi enviado.`}
                    }   

            }catch(e){
                        return { success: false, message: `[X] Erro ao tentar atualizar Requerimento ${codeRequeriment} ${e}`}
        }       
    } 

    static async send(codeRequeriment: number ){

            try{

                    const [ verifyRequerimentToSend ] = await dbConn.query(`SELECT codigo_sistema FROM  ${MOBILE}.requerimentos where codigo_sistema = '${codeRequeriment}'`);
                    const isverifiedRequeriment = verifyRequerimentToSend as { codigo_sistema : number}[];

                    if( isverifiedRequeriment.length > 0 ){
                        console.log(`[X] Requerimento ${codeRequeriment} já foi enviado.`)
                    }else{

                        const ErpRequirement  =  await RequirementRepository.findRequeriments({ codigo: codeRequeriment})
                    
                        const ErpProdRequer  = await RequirementRepository.findProductsRequeriment(codeRequeriment);

                        const loteSerieRequer =   await RequirementRepository.findLoteSeriesRequeriment(codeRequeriment);

                        const resultMapping =  RequerimentMapping.mapping(ErpRequirement[0], ErpProdRequer, loteSerieRequer)
                            
                        const request = new RequirementRequest();

                            const resultRequest = await request.post(resultMapping);


                            if(resultRequest.success){
                                if(resultRequest.data){

                                    const sqlInsertRequeriment = `INSERT INTO ${MOBILE}.requerimentos SET id_mobile = ?, codigo_sistema  = ? 
                                        ON DUPLICATE KEY UPDATE codigo_sistema =  ? 
                                    `;
                                    const values = [resultRequest.data.codigo, codeRequeriment, codeRequeriment ]
                                    await dbConn.query(sqlInsertRequeriment, values);
                                }else{
                                console.log(`[X]  ERRO ao tentar enviar Requerimento ${codeRequeriment} ${resultRequest}.`)
                                }

                            }else{
                                console.log(`[X]  ERRO ao tentar enviar Requerimento ${codeRequeriment} ${resultRequest.message}.`)
                            }
                                    return resultRequest;

                    }
        }catch(e){
          return { success: false, message: `[X] Erro ao tentar atualizar Requerimento ${codeRequeriment} ${e}`}

        }

    }
}