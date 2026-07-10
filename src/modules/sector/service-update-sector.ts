import { SectorRequest } from "./sector-request.ts";
import { type setores } from "./contracts/setores.ts";
import { getSetores } from "./repository-setor.ts";

export class ServiceUpdateSector {

    static async update(codeSectorErp: number, idSectorMobile: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: any }

        try {
            const resultSetor = await getSetores(codeSectorErp) as setores[];

            if (resultSetor.length === 0) {
                resultfunction.success = false;
                resultfunction.message = `Setor codigo ${codeSectorErp} não foi encontrado(a)`
            } else {
                const { CODIGO, NOME, DATA_CADASTRO } = resultSetor[0];

                const resultRequest = await SectorRequest.put(
                    {
                        id: String(CODIGO),
                        descricao: String(NOME),
                        data_cadastro: String(DATA_CADASTRO),
                    },
                    Number(idSectorMobile)
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
