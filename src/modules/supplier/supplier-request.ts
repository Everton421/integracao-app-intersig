import { isAxiosError } from "axios"
import { api } from "../../services/api.ts"

type inputPostSupplier = {
    codigo: number,
    id: string
    celular: string
    nome: string
    cep: string
    endereco: string
    ie: string
    numero: number
    cnpj: string
    cidade: string
    data_cadastro: string
    data_recadastro: string
    bairro: string
    estado: string
    ativo: string
}

type inputPutSupplier = {
    id: string
    celular: string
    nome: string
    cep: string
    endereco: string
    ie: string
    numero: number
    cnpj: string
    cidade: string
    data_cadastro: string
    data_recadastro: string
    bairro: string
    estado: string
}

type resultRequestSupplier = {
    codigo: number
    id: string
    celular: string
    nome: string
    cep: string
    endereco: string
    ie: string
    numero: number
    cnpj: string
    cidade: string
    data_cadastro: string
    data_recadastro: string
    bairro: string
    estado: string
}

export class SupplierRequest {

    private origin = process.env.API_ORIGIN_NAME || 'erp_integration';

    static async post(supplier: inputPostSupplier) {

        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestSupplier | null }

        const { codigo } = supplier;

        try {

              const payload = {
                codigo: codigo,
                id: String(supplier.id),
                celular: String(supplier.celular),
                nome: String(supplier.nome),
                cep: String(supplier.cep),
                endereco: String(supplier.endereco),
                ie: String(supplier.ie),
                numero: String(supplier.numero),
                cnpj: String(supplier.cnpj),
                cidade: String(supplier.cidade),
                data_cadastro: String(supplier.data_cadastro),
                data_recadastro: String(supplier.data_recadastro),
                bairro: String(supplier.bairro),
                estado: String(supplier.estado),
            }
            const resultPost = await api.post("/fornecedores", payload,
                {
                    headers: {
                        source: new SupplierRequest().origin
                    }
                }
            )

            if (resultPost.status === 201) {
                resultfunction.data = resultPost.data as resultRequestSupplier;
                resultfunction.success = true;
            }

        } catch (e) {
            resultfunction.success = false;
            if (isAxiosError(e)) {
                resultfunction.message = e.response?.data.message;
            } else {
                resultfunction.message = `[x] Erro inesperado ao tentar registrar fornecedor na api, payload ${supplier}. ${e} `;
            }

        } finally {
            return resultfunction;
        }
    }

    static async put(supplier: inputPutSupplier, id_mobile: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestSupplier | null }

        try {
            const payload = {
                codigo: id_mobile,
                id: String(supplier.id),
                celular: String(supplier.celular),
                nome: String(supplier.nome),
                cep: String(supplier.cep),
                endereco: String(supplier.endereco),
                ie: String(supplier.ie),
                numero: String(supplier.numero),
                cnpj: String(supplier.cnpj),
                cidade: String(supplier.cidade),
                data_cadastro: String(supplier.data_cadastro),
                data_recadastro: String(supplier.data_recadastro),
                bairro: String(supplier.bairro),
                estado: String(supplier.estado),
            }

            const resultPut = await api.put("/fornecedores", payload,
                {
                    headers: {
                        source: new SupplierRequest().origin
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
                resultfunction.message = `[x] Erro inesperado ao tentar atualizar fornecedor na api, payload ${supplier}. ${e} `;
            }

        } finally {
            return resultfunction;

        }
    }

    static async delete(codigo: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultRequestSupplier | null }

        try {
            const resultDelete = await api.delete(`/fornecedores/${codigo}`,
                {
                    headers: {
                        source: new SupplierRequest().origin
                    }
                })
            if (resultDelete.status === 200) {
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
                resultfunction.message = `[x] Erro inesperado ao tentar deletar fornecedor na api, codigo: ${codigo}. ${e} `;
            }

        } finally {
            return resultfunction;

        }

    }

}
