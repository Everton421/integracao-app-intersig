import dbConn, { ESTOQUE, MOBILE  } from "../../database/connection/database-connection.ts";
import { type event } from "../../contracts/event.ts";
import { type prod_setor } from "../../contracts/prod_setor.ts";
import { delay } from "../../utils/delay.ts";
import { api } from "../../services/api.ts";

type produtos_enviados = {
        id:number  
        id_mobile:number 
        codigo_sistema:number
}

 

 
export async function serviceSendProdSetor(event: event) {
        let status = {sucess: true, message:'' , data: null };

                try{
                        const origin = process.env.API_ORIGIN_NAME || 'erp_integration';
 
                          const [resultProdSetorSistema] = await dbConn.query(`SELECT * FROM ${ESTOQUE}.prod_setor  `);

                                                const arrProdSetorSistema = resultProdSetorSistema as prod_setor[]
                                                const PROD_SETOR = arrProdSetorSistema[0] as prod_setor;
                                                
                                                const [ resultVerifyProduct ] = await dbConn.query(`SELECT * FROM ${MOBILE}.produtos_enviados WHERE codigo_sistema = ${event.id_registro};`)   ; 
                                                const arrVerifyItems = resultVerifyProduct as produtos_enviados[]
                                                if(arrVerifyItems.length > 0 ){
                                                        const data = {
                                                                produto: Number(arrVerifyItems[0].id_mobile),
                                                                setor: Number(PROD_SETOR.SETOR),
                                                                data_recadastro: PROD_SETOR.DATA_RECAD,
                                                                estoque: Number(PROD_SETOR.ESTOQUE),
                                                                local1_produto: PROD_SETOR.LOCAL1_PRODUTO || '',
                                                                local2_produto: PROD_SETOR.LOCAL2_PRODUTO || '',
                                                                local3_produto: PROD_SETOR.LOCAL3_PRODUTO || '',
                                                                local4_produto: PROD_SETOR.LOCAL4_PRODUTO || '',
                                                                local_produto: PROD_SETOR.LOCAL_PRODUTO || ''
                                                        }
                                                        console.log(` Enviando saldo produto ${PROD_SETOR.PRODUTO}...`, )
                                                        await delay(500)
                                                        const result = await api.put("/produtos-setor", data,
                                                                        {
                                                                        headers:{
                                                                                source: origin
                                                                                }
                                                                        }
                                                                )
                                                            if( result.status === 200 || result.status === 201){
                                                                status.sucess = true;
                                                                }else{
                                                                status.sucess = false;
                                                             }

                                                }else{
                                                        console.log(`[X] Produto ${PROD_SETOR.PRODUTO} nao foi enviado.`)
                                                                status.sucess = false;
                                                          status.message =`[X] Produto ${PROD_SETOR.PRODUTO} nao foi enviado.`;
                                                 }
                       
                }catch(e){
                        console.log("Erro : ",e)
                                                                status.sucess = false;

                                                          status.message = String(e);

                }finally{
                        return status;
                } 

}
