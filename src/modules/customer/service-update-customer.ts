import { CustomerRequest } from "./customer-request.ts";
import { type cad_clie } from "./contracts/cad_clie.ts";
import { getAllClients } from "./repository-client.ts";

export class ServiceUpdateCustomer {

    static async update(codeCustomerErp:number, idCustomerMobile:number){
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data:  any }
        try{
     const resultCadClie = await getAllClients(codeCustomerErp) as cad_clie[];

            if (resultCadClie.length === 0) {
                    resultfunction.success = false;
                    resultfunction.message === `Cliente codigo ${codeCustomerErp} não foi encontrado `
            }else{
                const { NOME, CELULAR, CEP, ENDERECO, RG, NUMERO, CPF, CIDADE, DATA_CADASTRO, DATA_RECAD, VENDEDOR, BAIRRO, ESTADO } = resultCadClie[0];

                 const resultResquest = await CustomerRequest.put( 
                        {   
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
                            estado: String(ESTADO),
                            id: String(codeCustomerErp)
                         },
                         Number(idCustomerMobile)
                    )

                    if(resultResquest.success){
                                resultfunction.success = true;
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
