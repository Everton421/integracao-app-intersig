import { isAxiosError } from "axios"
import { api } from "../../services/api.ts"

type inputPostSector = {
    codigo: number,
    id: string
    descricao: string
    data_cadastro: string
}

type resultRequestPostSector = {
    codigo: number
    id: string,
    data_cadastro: string,
    descricao: string,
}

export class SectorRequest {

    private origin = process.env.API_ORIGIN_NAME || 'erp_integration';

    static async post(sector: inputPostSector) {

        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestPostSector | null }

        const { codigo, data_cadastro, descricao, id } = sector;

        try {

            const payload = { codigo, data_cadastro, descricao, id }
            const resultPost = await api.post("/setores", payload,
                {
                    headers: {
                        source: new SectorRequest().origin
                    }
                }
            )

            if (resultPost.status === 201) {
                resultfunction.data = resultPost.data as resultRequestPostSector;
                resultfunction.success = true;
            }

        } catch (e) {
            resultfunction.success = false;
            if (isAxiosError(e)) {
                resultfunction.message = e.response?.data.message;
            } else {
                resultfunction.message = `[x] Erro inesperado ao tentar registrar setor na api, payload ${sector}. ${e} `;
            }

        } finally {
            return resultfunction;
        }
    }

    static async put(sector: Omit<inputPostSector, 'codigo'>, id_mobile: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestPostSector | null }


        try {
            const payload = {
                codigo: id_mobile,
                id: String(id_mobile),
                descricao: sector.descricao,
                data_cadastro: sector.data_cadastro,
            }

            const resultPut = await api.put("/setores", payload,
                {
                    headers: {
                        source: new SectorRequest().origin
                    }
                }
            )
            if (resultPut.status === 200) {
                resultPut.data as { codigo: number, id: number, data_cadastro: string, descricao: string };
                resultfunction.success = true;
                resultfunction.data = resultPut.data;
            }

        } catch (e) {
            resultfunction.success = false;
            if (isAxiosError(e)) {
                resultfunction.message = e.response?.data.message;
                resultfunction = e.response?.data
            } else {
                resultfunction.message = `[x] Erro inesperado ao tentar atualizar setor na api, payload ${sector}. ${e} `;
            }

        } finally {
            return resultfunction;

        }
    }

}
