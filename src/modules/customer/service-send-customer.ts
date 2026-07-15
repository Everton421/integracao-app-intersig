import { type ResultSetHeader } from "mysql2";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { CustomerRequest } from "./customer-request.ts";
import { type cad_clie } from "./contracts/cad_clie.ts";
import { getAllClients } from "./repository-client.ts";

export class ServiceSendCustomer {
    static async send(codeCustomerErp:number){
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data:  any }
        try{
     const resultCadClie = await getAllClients(codeCustomerErp) as cad_clie[];

            if (resultCadClie.length === 0) {
                    resultfunction.success = false;
                    resultfunction.message === `Cliente codigo ${codeCustomerErp} não foi encontrado `
            }else{
                const { CODIGO, NOME, CELULAR, CEP, ENDERECO, RG, NUMERO, CPF, CIDADE, DATA_CADASTRO, DATA_RECAD, VENDEDOR, BAIRRO, ESTADO } = resultCadClie[0];

                 const resultResquest = await CustomerRequest.post( 
                        {   
                            codigo: Number(CODIGO),
                            id: String(CODIGO),
                            celular: String(CELULAR),
                            nome: String(NOME),
                            cep: String(CEP),
                            endereco: String(ENDERECO),
                            ie: String(RG),
                            numero: String(NUMERO),
                            cnpj: String(CPF),
                            cidade: String(CIDADE),
                            data_cadastro: DATA_CADASTRO,
                            data_recadastro: DATA_RECAD,
                            vendedor: Number(VENDEDOR),
                            bairro: String(BAIRRO),
                            estado: String(ESTADO)
                         }
                    )

                    if(resultResquest.success){
                        if( resultResquest.data &&  resultResquest.data.codigo){
                            const { codigo } = resultResquest.data;

                            const sqlInsert =`INSERT INTO ${MOBILE}.clientes_enviados ( id_mobile ,  codigo_sistema ) VALUES ( ? , ? ) ON DUPLICATE KEY UPDATE 
                               id_mobile = ? ,  codigo_sistema = ?
                                `;
                            const values = [ codigo , codeCustomerErp, codigo , codeCustomerErp ];
                            const [{ insertId }] = await dbConn.query(sqlInsert, values ) as ResultSetHeader[]; 
                            if( insertId > 0 ){
                                resultfunction.success = true;
                            }else{
                                resultfunction.success = false;
                                resultfunction.message = `[X] Algo de inesperado ocorreu ao tentar registrar cliente[ERP] na tabela clientes_enviados ${codeCustomerErp}.`;
                            }
                        }
                    }else{
                        resultfunction.data = resultResquest.data;
                        resultfunction.success = resultResquest.success;
                        resultfunction.message = resultResquest.message;
                    }
            }

        }catch(e){
                resultfunction.success = false;
                resultfunction.message = String(e);
        }finally{
            return resultfunction;
        }
      
    } 
}
