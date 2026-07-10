import { isAxiosError } from "axios"
import { api } from "../../services/api.ts"

type inputPostServiceType = {
    codigo: number,
    id: number
    descricao: string
    data_cadastro: string
    data_recadastro: string
}

type resultRequestPostServiceType = {
    codigo: number
    id: number
    descricao: string
    data_cadastro: string
    data_recadastro: string
}

export class ServiceTypeRequest {

    private origin = process.env.API_ORIGIN_NAME || 'erp_integration';

    static async post(serviceType: inputPostServiceType) {

        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestPostServiceType | null }

        const { codigo, id, descricao, data_cadastro, data_recadastro } = serviceType;

        try {

            const payload = { codigo, id: String(id), descricao, data_cadastro, data_recadastro }
            const resultPost = await api.post("/tipo_os", payload,
                {
                    headers: {
                        source: new ServiceTypeRequest().origin
                    }
                }
            )

            if (resultPost.status === 201 || resultPost.status === 200  ) {
                resultfunction.data = resultPost.data as resultRequestPostServiceType;
                resultfunction.success = true;
            }

        } catch (e) {
            resultfunction.success = false;
            if (isAxiosError(e)) {
                resultfunction.message = e.response?.data.message;
            } else {
                resultfunction.message = `[x] Erro inesperado ao tentar registrar tipo de os na api, payload ${serviceType}. ${e} `;
            }

        } finally {
            return resultfunction;
        }
    }

    static async put(serviceType: Omit<inputPostServiceType, 'codigo'>, id_mobile: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestPostServiceType | null }


        try {
            const payload = {
                codigo: id_mobile,
                id: String(serviceType.id),
                descricao: serviceType.descricao,
                data_cadastro: serviceType.data_cadastro,
                data_recadastro: serviceType.data_recadastro,
            }

            const resultPut = await api.put("/tipo_os", payload,
                {
                    headers: {
                        source: new ServiceTypeRequest().origin
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
                resultfunction.message = `[x] Erro inesperado ao tentar atualizar tipo de os na api, payload ${serviceType}. ${e} `;
            }

        } finally {
            return resultfunction;

        }
    }

}
