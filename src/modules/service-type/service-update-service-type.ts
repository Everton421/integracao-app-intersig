import { ServiceTypeRequest } from "./service-type-request.ts";
import { type tipos_os } from "./contracts/tipos_os.ts";
import { getServiceType } from "./repository-service-type.ts";

export class ServiceUpdateServiceType {

    static async update(codeServiceTypeErp: number, idServiceTypeMobile: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: any }

        try {
            const resultServiceType = await getServiceType(codeServiceTypeErp) as tipos_os[];

            if (resultServiceType.length === 0) {
                resultfunction.success = false;
                resultfunction.message = `Tipo de OS codigo ${codeServiceTypeErp} não foi encontrado(a)`
            } else {
                const { CODIGO, DESCRICAO, updated_at } = resultServiceType[0];

                const resultRequest = await ServiceTypeRequest.put(
                    {
                        id: Number(CODIGO),
                        descricao: String(DESCRICAO),
                        data_cadastro: String(updated_at),
                        data_recadastro: String(updated_at),
                    },
                    Number(idServiceTypeMobile)
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
