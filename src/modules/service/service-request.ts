import { isAxiosError } from "axios"
import { api } from "../../services/api.ts"

type inputPostService = {
    codigo: number,
    id: string
    valor: number
    aplicacao: string
    tipo_serv: number
    descricao: string
    data_cadastro: string
    data_recadastro: string
}

type resultRequestPostService = {
    codigo: number
    id: string
    valor: number
    aplicacao: string
    tipo_serv: number
    descricao: string
    data_cadastro: string
    data_recadastro: string
}

export class ServiceRequest {

    private origin = process.env.API_ORIGIN_NAME || 'erp_integration';

    static async post(service: inputPostService) {

        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestPostService | null }

        const { codigo, id, valor, aplicacao, tipo_serv, descricao, data_cadastro, data_recadastro } = service;

        try {

            const payload = { codigo, id, valor, aplicacao, tipo_serv, descricao, data_cadastro, data_recadastro }
            const resultPost = await api.post("/servicos", payload,
                {
                    headers: {
                        source: new ServiceRequest().origin
                    }
                }
            )

            if (resultPost.status === 201) {
                resultfunction.data = resultPost.data as resultRequestPostService;
                resultfunction.success = true;
            }

        } catch (e) {
            resultfunction.success = false;
            if (isAxiosError(e)) {
                resultfunction.message = e.response?.data.message;
            } else {
                resultfunction.message = `[x] Erro inesperado ao tentar registrar servico na api, payload ${service}. ${e} `;
            }

        } finally {
            return resultfunction;
        }
    }

    static async put(service: Omit<inputPostService, 'codigo'>, id_mobile: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestPostService | null }


        try {
            const payload = {
                codigo: id_mobile,
                id: service.id,
                valor: service.valor,
                aplicacao: service.aplicacao,
                tipo_serv: service.tipo_serv,
                descricao: service.descricao,
                data_cadastro: service.data_cadastro,
                data_recadastro: service.data_recadastro,
            }

            const resultPut = await api.put("/servicos", payload,
                {
                    headers: {
                        source: new ServiceRequest().origin
                    }
                }
            )
            if (resultPut.status === 200) {
                resultfunction.success = true;
                resultfunction.data = resultPut.data;
            }

        } catch (e) {
            resultfunction.success = false;
            if (isAxiosError(e)) {
                resultfunction.message = e.response?.data.message;
                resultfunction = e.response?.data
            } else {
                resultfunction.message = `[x] Erro inesperado ao tentar atualizar servico na api, payload ${service}. ${e} `;
            }

        } finally {
            return resultfunction;

        }
    }

}
