import { type Pool, type ResultSetHeader } from "mysql2/promise";
import { type dataProdSectorErp } from "../interfaces/data-prod-sector-erp.ts";
import { type dataProdSectorReceived } from "../interfaces/data-prod-sector-received.ts";

export class ProdSectorDataAcess { 

       private connection :Pool
    
        constructor(connection: Pool){
            this.connection = connection; 
        }

    async updateProdSector( dataProdSector: dataProdSectorReceived , databaseStock:string ){
         const sqlProd_setor = ` INSERT INTO ${databaseStock}.prod_setor  
                             set
                            ESTOQUE = ${dataProdSector.estoque},
                            LOCAL1_PRODUTO = '${dataProdSector.local1_produto}',
                            LOCAL2_PRODUTO = '${dataProdSector.local2_produto}',
                            LOCAL3_PRODUTO = '${dataProdSector.local3_produto}',
                            DATA_RECAD = NOW(),
                            LOCAL4_PRODUTO = '${dataProdSector.local4_produto}',
                            PRODUTO = '${dataProdSector.produto}',
                            SETOR = '${dataProdSector.setor}'
                            ON DUPLICATE KEY UPDATE
                            ESTOQUE = ${dataProdSector.estoque},
                            LOCAL1_PRODUTO = '${dataProdSector.local1_produto}',
                            LOCAL2_PRODUTO = '${dataProdSector.local2_produto}',
                            LOCAL3_PRODUTO = '${dataProdSector.local3_produto}',
                            DATA_RECAD = NOW(),
                            LOCAL4_PRODUTO = '${dataProdSector.local4_produto}' 
                         `;
                        
                            const [ result ]   = await this.connection.query(sqlProd_setor)  
                            return result as ResultSetHeader;
    }

    async updateStockByProductAndSector(databaseStock:string, product:number, sector:number, quantity:number ){
         let sqlProd_setor = ` INSERT INTO ${databaseStock}.prod_setor  
                             set
                            ESTOQUE = ? ,
                            DATA_RECAD = NOW(),
                            PRODUTO = ?,
                            SETOR = ? 
                            ON DUPLICATE KEY UPDATE
                           ESTOQUE= ? 

                         `;

                     
                  const [ result ]   = await this.connection.query(sqlProd_setor, [ quantity, product, sector ,quantity ])  
                            return result as ResultSetHeader;
    }

     async findStockByProductAndSector(databaseStock:string, produto:number, setor:number){
            const sqlStock = `SELECT * FROM  ${databaseStock}.prod_setor WHERE PRODUTO = ? AND SETOR = ? `;
           const [arrCurrentStockAtDestinationSector] = await this.connection.query(sqlStock, [ produto,  setor]);
           return arrCurrentStockAtDestinationSector as dataProdSectorErp[]
    }
 
     async findTotalStockProductAndSector(databaseStock:string, produto:number, setor?:number){
         let sqlStock = `SELECT ESTOQUE FROM  ${databaseStock}.prod_setor WHERE PRODUTO = ? `;
         const valuesSearch = [produto];
            if(setor){
               sqlStock += ` AND SETOR = ?  `
               valuesSearch.push(setor);
            }

           const [arrCurrentStockAtDestinationSector] = await this.connection.query(sqlStock, valuesSearch);
           return arrCurrentStockAtDestinationSector as {ESTOQUE: number}[]
     }

}