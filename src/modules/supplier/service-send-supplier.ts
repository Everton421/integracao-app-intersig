import dbConn, { MOBILE, PUBLICO } from "../../database/connection/database-connection.ts";
import { type cad_clie } from "../../contracts/cad_clie.ts";
import { type cad_forn } from "../../contracts/cad_forn.ts";
import { type event } from "../../contracts/event.ts";
import { type table_enviados } from "../../contracts/table-enviados.ts";
import { DateService } from "../../utils/date.ts";
import { api } from "../../services/api.ts";

type clientes_enviados = {
        id: number,
        id_mobile: number,
        codigo_sistema: number
}

export async function serviceSendSupplier(event: event) {

        const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

        console.log("[V] Verificando MOBILE_fornecedores_sistema ...")

        if (event.tipo_evento === 'DELETE') {
                const status = { sucess: false, message: `Evento ${event.tipo_evento} ${event.tabela_origem} ainda não foi configurado.` };
                console.log(`Evento ${event.tipo_evento} ${event.tabela_origem} ainda não foi configurado.`);
                return status;
        }

        const dateService = new DateService();

        let sql = ` select *,
                              DATE_FORMAT(DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                              DATE_FORMAT(DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                            from ${PUBLICO}.cad_forn f
                              WHERE
                            f.CODIGO = ${event.id_registro}  
                            `
        const [resultVerifyClient] = await dbConn.query(`SELECT * FROM ${MOBILE}.fornecedores_enviados where codigo_sistema = ${event.id_registro};`);
        const arrVerifyClient = resultVerifyClient as table_enviados[]
        const fonrVerify = arrVerifyClient[0];

        if (arrVerifyClient.length > 0) {
                const [resultClient] = await dbConn.query(sql)
                const arrforn = resultClient as cad_forn[];
                const forn = arrforn[0]

                const data = {
                        codigo: Number(fonrVerify.id_mobile),
                        id: fonrVerify.codigo_sistema,
                        celular: forn.TELEFONE,
                        nome: forn.NOME_FANTASIA,
                        cep: forn.CEP,
                        endereco: forn.ENDERECO,
                        ie: forn.INSCRICAO,
                        numero: forn.NUMERO,
                        cnpj: forn.CNPJ,
                        cidade: forn.CIDADE,
                        data_cadastro: dateService.obterDataAtual(),
                        data_recadastro: dateService.obterDataHoraAtual(),
                        bairro: forn.BAIRRO,
                        estado: forn.ESTADO
                }
                const resultPut = await api.put("/fornecedores", data,
                        {
                                headers: {
                                        source: origin
                                }
                        }
                )
                if (resultPut.status === 200) {
                        return { sucess: true, message: '' };
                } else {
                        return { sucess: false, message: '' };
                }

        } else {

                const [resultClient] = await dbConn.query(sql)
                const arrforn = resultClient as cad_forn[];

                const forn = arrforn[0]
                const payload = {
                        id: String(forn.CODIGO),
                        celular: forn.TELEFONE,
                        nome: forn.NOME_FANTASIA,
                        cep: forn.CEP,
                        endereco: forn.ENDERECO,
                        ie: forn.INSCRICAO,
                        numero: forn.NUMERO,
                        cnpj: forn.CNPJ,
                        cidade: forn.CIDADE,
                        data_cadastro: dateService.obterDataAtual(),
                        data_recadastro: dateService.obterDataHoraAtual(),
                        bairro: forn.BAIRRO,
                        estado: forn.ESTADO,
                        ativo: forn.ATIVO
                }

                try {
                        const resultPost = await api.post("/fornecedores", payload,
                                {
                                        headers: {
                                                source: origin
                                        }
                                }
                        )

                        if (resultPost.status === 201) {
                                const data = resultPost.data as any
                                try{

                                await dbConn.query(`INSERT INTO ${MOBILE}.fornecedores_enviados set codigo_sistema = ${forn.CODIGO}, id_mobile= ${data.codigo}`)

                                }catch(e){
                                        console.log(e)
                                }
                                return { sucess: true, message: '' };

                        }
                } catch (e) {
                        console.log(e)
                        return { sucess: false, message: '' };

                }


        }



}
