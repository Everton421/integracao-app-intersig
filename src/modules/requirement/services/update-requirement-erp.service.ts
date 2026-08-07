import { type EventRequirement } from "../contracts/event-requirement.ts";
import { RequirementDataAcess } from "../requirement-data-acess.ts";

export class UpdateRequirementErpService{
    
    static async execute(event: Omit<EventRequirement, 'codigo'>, codeErpRequirement:number ){
            let dataResultFunction =  {  success: false, message: '', data:  0 } as {  success: boolean, message: string, data: number }
            try{    

    
                       const resultUpdateRequirement = await RequirementDataAcess.updateRequirement(event, codeErpRequirement)
        
                          if (resultUpdateRequirement.affectedRows) {
                                //exclui os produtos do requerimento 
                                const resultDeleteItensRequeriment = await RequirementDataAcess.deleteItensRequeriment(codeErpRequirement);
                                    // exclui os lotes e series do requerimento
                                const resultDeleteLotesSeriesRequerimento = await RequirementDataAcess.deleteLotesSeriesRequerimento(codeErpRequirement);
                                //insere os produtos e lote series do requerimento 
                                const resultInsertItensRequeriment = await RequirementDataAcess.insertItensRequerimento(codeErpRequirement, event.itens);
                        }

                         dataResultFunction.success = true;
                         dataResultFunction.message= `[V] Requerimento [ERP]:${codeErpRequirement} atualizado com sucesso.`;
                         return dataResultFunction;
        }catch( e ){
            dataResultFunction.message = `[X] Erro ao tentar atualizar requerimento [ERP]:${codeErpRequirement}.`
            }finally{   
                return dataResultFunction
            }
      }
}