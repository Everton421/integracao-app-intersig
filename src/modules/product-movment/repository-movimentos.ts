import { type ResultSetHeader } from "mysql2"
import { type message_movimento_produtos } from "./contracts/message-movimentos-produtos.ts"
import dbConn, { MOBILE, VENDAS } from "../../database/connection/database-connection.ts"
import { DateService } from "../../utils/date.ts"

type movimentos= {
 id:number
 id_mobile:number
 codigo_sistema:number
}

  

   type ace_hist = {
      ITEM:number
     TIPO: 'A' | 'B' | 'E' | 'F' | 'P' | 'PU' | 'PP' |'PSD' | 'PST' | 'R' | 'PR'  //A=Acerto; B=Balanço; E=Expedição; F=Faturamento; P=Produção (Prod. Acabado); PU=Produção (Prod. Utilizado); PP=Produção (Prod. Perdido); PSD=Produção (Prod. Substituído); PST=Produção (Prod. Substituto); R=Requerimento; PR=Produção (Resíduo)
      HISTORICO:string
      USUARIO:number
      SETOR:number
   }

   export async function insertMvto_produtos(mvto:message_movimento_produtos ) {
         let resultFunction = { message: null , success:false } as { success: boolean , message: string | null}
      
      try{
         
               const [ verifyMvtos ] = await dbConn.query(`SELECT * FROM ${MOBILE}.movimentos_produtos where id_mobile = '${mvto.codigo}'`)    
               const resultVerifyMvtos = verifyMvtos as movimentos[]
               const dateService = new DateService();
               

               if( resultVerifyMvtos && resultVerifyMvtos.length > 0 ){
                     resultFunction.success = true; 
                     resultFunction.message = `[X] O movimento ${mvto.codigo} já foi registrado. `; 
                     console.log(resultFunction.message);

                  }else{
            
                     console.log(`[SQl] Registrando mvto_produtos  produto: ${mvto.produto} `)
                        const sqlAce_hist = ` SELECT max(ITEM) as ITEM FROM ${VENDAS}.ace_hist;`
                        const [ arrAce_hist  ] =  await dbConn.query(sqlAce_hist);
                        const ace_hist = arrAce_hist as ace_hist[];

                        let codigoAcerto  = 1 ;
                              if(ace_hist.length > 0 ){
                                 codigoAcerto = ace_hist[0].ITEM + 1;
                              }
                  const sqlInsertAceHist = 
                                 ` INSERT INTO ${VENDAS}.ace_hist 
                                 ( ITEM, TIPO, HISTORICO, USUARIO, SETOR  )  
                                 VALUES
                                 ( ${codigoAcerto}, '${mvto.tipo}', '${mvto.historico}',  '${mvto.usuario}',  ${mvto.setor} )
                              `
                           const [ resultInserAce] = await dbConn.query(sqlInsertAceHist) as ResultSetHeader[];

                 const sql = ` INSERT INTO ${VENDAS}.mvto_produtos 
                              ( chave_mvto ,
                                 item ,
                                 tipo ,
                                 ent_sai ,
                                 setor ,
                                 mov_saldo ,
                                 produto ,
                                 grade ,
                                 padronizado ,
                                 unidade ,
                                 item_unid ,
                                 fator_qtde ,
                                 fator_val ,
                                 quantidade ,
                                 data_mvto ,
                                 hora_mvto ,
                                 just_ipi ,
                                 just_icms ,
                                 just_subst 
                                 )values(
                                  ${0},
                                  ${codigoAcerto},
                                  'A',
                                  '${mvto.ent_sai}',
                                  ${mvto.setor},
                                  'S',
                                  ${mvto.produto},
                                   0,
                                   0,
                                  '${mvto.unidade_medida}',
                                   0,
                                   1,
                                   1,
                                  ${mvto.quantidade},
                                  '${mvto.data_recadastro}',
                                  '${dateService.obterHora( mvto.data_recadastro)}',
                                  '',
                                  '',
                                  ''
                                 );
                              `
                              // console.log(sql)
                           const [ result ] = await dbConn.query(sql )
                           //console.log(result)
                              const sqlInsertlog = ` INSERT INTO ${VENDAS}.log 
                              (
                              APELIDO,
                              COMPUTADOR,
                              DATA,
                              HORA,
                              ACAO,
                              HISTORICO,
                              IP_CPU
                              ) VALUES(
                              'MOBILE',
                              'SERVIDOR',
                              '${dateService.obterDataAtual()}',
                              '${dateService.obterHoraAtual()}',
                              '${1}',
                              ' ACERTO DE ESTOQUE -  Produto: ${mvto.produto}; Quantidade: ${mvto.quantidade}'  ,
                              '' 
                                 );`;
                              await dbConn.query(sqlInsertlog);
                              
                                 await dbConn.query(`INSERT INTO ${MOBILE}.movimentos_produtos SET id_mobile ='${mvto.codigo}', codigo_sistema = '${codigoAcerto}';`)
                        }
        }catch(e){
           resultFunction.success =false;
           resultFunction.message = `[X] Ocorreu um erro ao tentar registrar o movimento de produto ${mvto.codigo}`;
           console.log(resultFunction.message)
           console.log(e)

        }finally{
           return resultFunction
        }   

    }

