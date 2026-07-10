import { SupplierRequest } from "./supplier-request.ts";
import { type cad_forn } from "./contracts/cad_forn.ts";
import { getSupplier } from "./repository-supplier.ts";

export class ServiceUpdateSupplier {

    static async update(codeSupplierErp: number, idSupplierMobile: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: any }

        try {
            const resultSupplier = await getSupplier(codeSupplierErp) as cad_forn[];

            if (resultSupplier.length === 0) {
                resultfunction.success = false;
                resultfunction.message = `Fornecedor codigo ${codeSupplierErp} não foi encontrado(a)`
            } else {
                const {
                    CODIGO, NOME_FANTASIA, TELEFONE, CEP, ENDERECO,
                    INSCRICAO, NUMERO, CNPJ, CIDADE, DATA_CADASTRO,
                    DATA_RECAD, BAIRRO, ESTADO
                } = resultSupplier[0];

                const resultRequest = await SupplierRequest.put(
                    {
                        id: String(CODIGO),
                        celular: String(TELEFONE),
                        nome: String(NOME_FANTASIA),
                        cep: String(CEP),
                        endereco: String(ENDERECO),
                        ie: String(INSCRICAO),
                        numero: Number(NUMERO),
                        cnpj: String(CNPJ),
                        cidade: String(CIDADE),
                        data_cadastro: String(DATA_CADASTRO),
                        data_recadastro: String(DATA_RECAD),
                        bairro: String(BAIRRO),
                        estado: String(ESTADO),
                    },
                    Number(idSupplierMobile)
                )

                if (resultRequest.success) {
                    resultfunction.success = true;
                } else {
                    resultfunction.data = resultRequest.data;
                    resultfunction.success = resultRequest.success;
                    resultfunction.message = resultRequest.message;
                }
            }

        } catch (e) {
            resultfunction.success = false;
            resultfunction.message = String(e);
        } finally {
            return resultfunction;
        }

    }
}
