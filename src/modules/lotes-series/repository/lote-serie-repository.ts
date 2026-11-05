import mysql, { type ResultSetHeader } from 'mysql2/promise';
import { type lotes_series } from '../contracts/lotes_series.ts';
import { type table_enviados } from '../../../contracts/table-enviados.ts';

export class LoteSerieRepository{

    private connection: mysql.Pool
    private databasePublic:string 
    private databaseMobile:string

    constructor(connection: mysql.Pool, databaseStock:string, databaseMobile:string  ) {
        this.connection = connection;
        this.databasePublic = databaseStock;
        this.databaseMobile = databaseMobile;
    }  

    /**
     * obtem todas as series ou um especifica pelo codigo do erp.
     * @param code codigo do erp.
     * @returns 
     */
    async findByCode(code?: number){
        let sql = `SELECT ls.* FROM ${this.databasePublic}.lotes_series ls`;
        let complement = `;`;
        if (code && code != undefined) {
            complement = ` WHERE ls.CODIGO = ${code};`;
        }
        const finalSql = sql + complement;
        const [result] = await this.connection.query(finalSql);
        return result as lotes_series[];
    }
    /**
     * obtem todas as lotes e series do erp.
     */
    async findAll(){
        const sql = `SELECT ls.* FROM ${this.databasePublic}.lotes_series ls`; 
           const [result] = await this.connection.query(sql);
        return result as lotes_series[];
    }

        /**
         * Registra o lote serie sincronizado na tabela de enviados.
         * @param mobileCode 
         * @param erpCode 
         * @returns 
         */
    async insertSynced(mobileCode:number, erpCode:number ){
            const sqlInsert = `INSERT INTO ${this.databaseMobile}.lotes_series_enviadas (id_mobile, codigo_sistema) VALUES (?, ?)`;
            const values = [mobileCode, erpCode];
            const [{ insertId }] = await this.connection.query(sqlInsert, values) as ResultSetHeader[];
            return insertId;
        }

       /**
        * consulta o lote serie na tabela de enviados pelo codigo do sistema.
        * @param erpCode codigo do lote serie no sistema.
        * @returns 
        */
        async findSincedByErpCode(erpCode:number){
              const sql = `SELECT * FROM ${this.databaseMobile}.lotes_series_enviadas WHERE codigo_sistema = '${erpCode}';`
            const [resultVerifySended] = await this.connection.query(sql)
          
           return resultVerifySended as table_enviados[]

        }

        async bulkUpInsert(){
            
        }
}