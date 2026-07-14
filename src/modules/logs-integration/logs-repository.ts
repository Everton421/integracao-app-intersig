import { type ResultSetHeader } from "mysql2"
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts"


type inputRegisterLog = {
status: string
id_message: string
id_registro: number
dados_sql: string
json_payload: string
detalhes_erro: string
detalhes: string
tabela_origem: string
tipo_evento: string
criado_em:string
}

 export class LogsRepository{
    static async registerLogs( input: Partial<Omit<inputRegisterLog, 'criado_em'>> ){
        const params=[];
        const values=[];

        const baseSql = `INSERT INTO ${MOBILE}.logs SET `;

            if(input.status){
                params.push(' status = ? ');
                values.push(input.status);
            }
            if(input.id_message){
                params.push(' id_message = ? ');
                values.push(input.id_message);
            }
            if(input.id_registro){
                params.push(' id_registro = ? ');
                values.push(input.id_registro);
            }
            if(input.dados_sql){
                params.push(' dados_sql = ? ');
                values.push(input.dados_sql);
            }
            if(input.json_payload){
                params.push(' json_payload = ? ');
                values.push(input.json_payload);
            }
            if(input.detalhes_erro){
                params.push(' detalhes_erro = ? ');
                values.push(input.detalhes_erro);
            }
            if(input.detalhes){
                params.push(' detalhes = ? ');
                values.push(input.detalhes);
            }
            if(input.tabela_origem){
                params.push(' tabela_origem = ? ');
                values.push(input.tabela_origem);
            }
            if(input.tipo_evento){
                params.push(' tipo_evento = ? ');
                values.push(input.tipo_evento);
            }

            const finalSql = baseSql +  params.join(' , ');

            const [ result ] = await dbConn.query(finalSql, values)
              return result as ResultSetHeader;

    }
}