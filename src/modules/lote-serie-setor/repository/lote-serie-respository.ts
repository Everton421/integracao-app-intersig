import mysql, { type ResultSetHeader } from 'mysql2/promise';
import { lote_serie_setor } from '../contracts/lote-serie-setor.ts';

 

export class LoteSerieSectorRepository {
    private connection: mysql.Pool
    private databaseStock:string 
    constructor(connection: mysql.Pool, databaseStock:string  ) {
        this.connection = connection;
        this.databaseStock=databaseStock;

    }   

    async findAll() {
        const sql = `SELECT * FROM ${this.databaseStock}.lote_serie_setor ;`;
        const [resultQueryLotesSeriesSetor] = await this.connection.query(sql);
        return resultQueryLotesSeriesSetor as lote_serie_setor[];
    }
    async findById(  id: number) {
        const sql = `SELECT * FROM ${this.databaseStock}.lote_serie_setor WHERE id = ? ;`;
        const [resultQueryLotesSeriesSetor] = await this.connection.query(sql, id);
        return resultQueryLotesSeriesSetor as lote_serie_setor[];
    }
    async updateLoteSerieSetor(  setor: number, produto: number, lote_serie: number, estoque: number) {
        const sqlUpdateLoteSerieSetor = ` INSERT INTO ${this.databaseStock}.lote_serie_setor SET 
                                                      SETOR = ?,
                                                      PRODUTO =?,
                                                      LOTE_SERIE =?,
                                                      ESTOQUE = ?
                                                          ON DUPLICATE KEY UPDATE 
                                                      ESTOQUE = ? `

        const dataStockSeries = [setor, produto, lote_serie, estoque, estoque];
        const [resultStockSeries] = await this.connection.query(sqlUpdateLoteSerieSetor, dataStockSeries)
        return resultStockSeries as ResultSetHeader
    }


    async findStockSeriesByProductAndSector( product: number, loteSerie: number, sector: number) {
        const sqlStockSeries = `SELECT * FROM  ${this.databaseStock}.lote_serie_setor WHERE PRODUTO = ? AND LOTE_SERIE = ? AND SETOR = ? `;

        const [arrCurrentStockSeriesAtSourceSector] = await this.connection.query(sqlStockSeries, [product, loteSerie, sector]);
        return arrCurrentStockSeriesAtSourceSector as lote_serie_setor[];

    }
}
