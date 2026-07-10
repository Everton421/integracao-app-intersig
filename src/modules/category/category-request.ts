import { isAxiosError } from "axios"
import { api } from "../../services/api.ts"


type inputPostbrand = {
    codigo: number,
    id: string
    descricao: string
    data_cadastro: string
    data_recadastro: string
    ativo: 'S' | 'N'
}

type resultRequestPostbrand = {
    codigo: number
    id: string,
    data_cadastro: string,
    data_recadastro: string,
    descricao: string,
    ativo: string
}


export class CategoryRequest {

    private origin = process.env.API_ORIGIN_NAME || 'erp_integration';

    static async post(brand: inputPostbrand) {

        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestPostbrand | null }

        const { codigo, data_cadastro, data_recadastro, descricao, id } = brand;

        try {

            const payload = { codigo, data_cadastro, data_recadastro, descricao, id }
            const resultPost = await api.post("/categorias", payload,
                {
                    headers: {
                        source: new CategoryRequest().origin
                    }
                }
            )

            if (resultPost.status === 201) {
                resultfunction.data = resultPost.data as resultRequestPostbrand;
                resultfunction.success = true;
            }

        } catch (e) {
            resultfunction.success = false;
            if (isAxiosError(e)) {
                resultfunction.message = e.response?.data.message;
            } else {
                resultfunction.message = `[x] Erro inesperado ao tentar registrar categoria na api, payload ${brand}. ${e} `;
            }

        } finally {
            return resultfunction;
        }
    }

    static async put(brand: Omit<inputPostbrand, 'codigo'>, id_mobile: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestPostbrand | null }


        try {
            const payload = {
                codigo: id_mobile,
                id: String(id_mobile),
                descricao: brand.descricao,
                data_cadastro: brand.data_cadastro,
                data_recadastro: brand.data_recadastro,
            }

            const resultPut = await api.put("/categorias", payload,
                {
                    headers: {
                                     source: new CategoryRequest().origin

                    }
                }
            )
            if (resultPut.status === 200) {
                resultPut.data as { codigo: number, id: number, data_cadastro: string, data_recadastro: string, descricao: string, ativo: 'S' | 'N' };
                resultfunction.success = true;
                resultfunction.data = resultPut.data;
            }

        } catch (e) {
            resultfunction.success = false;
            if (isAxiosError(e)) {
                resultfunction.message = e.response?.data.message;
                    resultfunction = e.response?.data
            } else {
                resultfunction.message = `[x] Erro inesperado ao tentar atualizar categoria na api, payload ${brand}. ${e} `;
            }

        } finally {
            return resultfunction;

        }
    }

    static async delete(codigo:number){
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestPostbrand | null }

        try {
        const resultDelete = await api.delete(`/categorias/${codigo}`, 
                {
                    headers: {
                                            source: new CategoryRequest().origin

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
                resultfunction.message = `[x] Erro inesperado ao tentar atualizar categoria na api, codigo: ${codigo}. ${e} `;
            }

        } finally {
            return resultfunction;

        }
        
    }

}
