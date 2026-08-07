import { type EventRequirement } from "../contracts/event-requirement.ts";
import { RequirementDataAcess } from "../requirement-data-acess.ts";

export class InsertRequirementErpService{

    /**
     *  Registra o requerimento no erp
     * @param event Evento do requireimento vindo do broker
     * @returns 
     */
    static async execute(event: EventRequirement){
        let resultFunction = { success: false, message: '', data: 0 }  as {  success: boolean, message: string, data: number };

        try{

         const resultInsertRequirement = await RequirementDataAcess.insertRequirement(event);
            
                if(resultInsertRequirement){
            
                     if (resultInsertRequirement > 0 && event.itens.length > 0) {
                                
                        await RequirementDataAcess.insertItensRequerimento(resultInsertRequirement, event.itens);

                      }

                    resultFunction.success = true
                    resultFunction.message = `Requerimento ${event.codigo} registrado com sucesso no sistema !`;
                    resultFunction.data = resultInsertRequirement    
                }
        }catch(e){
            resultFunction.message = `Erro ao registrar requerimento ${event.codigo} no sistema, ${e}`;
       }finally{
        return resultFunction
       }
       
    }
}