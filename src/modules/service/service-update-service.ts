import { ServiceRequest } from "./service-request.ts";
import { type cad_serv } from "./contracts/cad_serv.ts";
import { getService } from "./repository-service.ts";

export class ServiceUpdateService {

    static async update(codeServiceErp: number, idServiceMobile: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: any }

        try {
            const resultService = await getService(codeServiceErp) as cad_serv[];

            if (resultService.length === 0) {
                resultfunction.success = false;
                resultfunction.message = `Servico codigo ${codeServiceErp} não foi encontrado(a)`
            } else {
                const { CODIGO, DESCRICAO, VALOR, APLICACAO, TIPO_SERV, DATA_CADASTRO, updated_at } = resultService[0];

                const resultRequest = await ServiceRequest.put(
                    {
                        id: String(CODIGO),
                        descricao: String(DESCRICAO),
                        valor: Number(VALOR),
                        aplicacao: String(APLICACAO),
                        tipo_serv: Number(TIPO_SERV),
                        data_cadastro: String(DATA_CADASTRO),
                        data_recadastro: String(updated_at),
                    },
                    Number(idServiceMobile)
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
