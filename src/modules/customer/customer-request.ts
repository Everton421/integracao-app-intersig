import { isAxiosError } from "axios"
import { api } from "../../services/api.ts"

type inputPostCustomer = {
    codigo: number,
    id: string
    celular: string
    nome: string
    cep: string
    endereco: string
    ie: string
    numero: string
    cnpj: string
    cidade: string
    data_cadastro: string
    data_recadastro: string
    vendedor: number
    bairro: string
    estado: string
}

    type resultRequestPostCustomer = 
    {
   codigo: number,
   id:  string ,
   celular: string,
   nome:  string ,
   cep:  string ,
   endereco: string,
   ie: string,
   numero:  string ,
   cnpj:  string ,
   cidade: string,
   data_cadastro:  string ,
   data_recadastro: string,
   vendedor: number,
   estado: string,
   bairro: string,
   ativo:  string 
}

export class CustomerRequest {
    private origin = process.env.API_ORIGIN_NAME || 'erp_integration';

    static async post(customer: inputPostCustomer) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestPostCustomer | null }

        const { bairro, celular, cep, cidade, cnpj, codigo, data_cadastro, data_recadastro, endereco, estado, id, ie, nome, numero, vendedor } = customer;

        try{ 

            const payload = { bairro, celular, cep, cidade, cnpj, codigo, data_cadastro, data_recadastro, endereco, estado, id, ie, nome, numero, vendedor }
            const resultPost = await api.post("/clientes", payload,
                        {
                            headers: {
                                source: new CustomerRequest().origin
                            }
                        }
                    )
                    if (resultPost.status === 201) {
                            resultfunction.data = resultPost.data as resultRequestPostCustomer;
                            resultfunction.success = true;
                        }
            
         } catch (e) {
                    resultfunction.success = false;
                    if (isAxiosError(e)) {
                        resultfunction.message = e.response?.data.message;
                    } else {
                        resultfunction.message = `[x] Erro inesperado ao tentar registrar cliente na api, payload ${customer}. ${e} `;
                    }
        
         } finally {
                    return resultfunction;
         }


    }

    static async put(customer: Omit<inputPostCustomer, 'codigo'>, id_mobile: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestPostCustomer | null }

        try {
            const payload = {
                codigo: id_mobile,
                id: String(id_mobile),
                celular: customer.celular,
                nome: customer.nome,
                cep: customer.cep,
                endereco: customer.endereco,
                ie: customer.ie,
                numero: customer.numero,
                cnpj: customer.cnpj,
                cidade: customer.cidade,
                data_cadastro: customer.data_cadastro,
                data_recadastro: customer.data_recadastro,
                vendedor: customer.vendedor,
                bairro: customer.bairro,
                estado: customer.estado
            }

            const resultPut = await api.put("/clientes", payload,
                {
                    headers: {
                        source: new CustomerRequest().origin
                    }
                }
            )
            if (resultPut.status === 200) {
                resultPut.data as { codigo: number, id: number, data_cadastro: string, data_recadastro: string, nome: string, ativo: 'S' | 'N' };
                resultfunction.success = true;
                resultfunction.data = resultPut.data;
            }

        } catch (e) {
            resultfunction.success = false;
            if (isAxiosError(e)) {
                resultfunction.message = e.response?.data.message;
                    resultfunction = e.response?.data
            } else {
                resultfunction.message = `[x] Erro inesperado ao tentar atualizar cliente na api, payload ${customer}. ${e} `;
            }

        } finally {
            return resultfunction;

        }
    }

    static async delete(codigo: number){
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestPostCustomer | null }

        try {
        const resultDelete = await api.delete(`/clientes/${codigo}`, 
                {
                    headers: {
                        source: new CustomerRequest().origin
                    }
          })
           if(resultDelete.status === 200 ){
                resultDelete.data as { success: boolean, message: string };
                resultfunction.success = true;
                resultfunction.message = resultDelete.data.message
                resultfunction.data = resultDelete.data
           }

          } catch (e) {
            resultfunction.success = false;
            if (isAxiosError(e)) {
                resultfunction.message = e.response?.data.message;
                resultfunction.data = e.response?.data;
            } else {
                resultfunction.message = `[x] Erro inesperado ao tentar deletar cliente na api, codigo: ${codigo}. ${e} `;
            }

        } finally {
            return resultfunction;

        }
        
    }

}