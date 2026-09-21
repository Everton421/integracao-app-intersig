import { type ResultSetHeader, type  Pool } from "mysql2/promise";
import { type TabelFotosProd } from "../interfaces/data-table-fotos-prod.ts";
 
export class PhotosProductDataAcess { 
    private connection :Pool

    constructor(connection: Pool){
        this.connection = connection; 
    }
    
    /**
     * 
     * @param publicDatabase banco de dados publico. 
     * @param mobileDatabase banco de dados mobile. 
     */
    async getPhotosNotSynced(publicDatabase: string , mobileDatabase:string ){
        const sql = ` 
            SELECT 
            FROM ${publicDatabase}.fotos_prod fp
            LEFT JOIN  ${mobileDatabase}.fotos_enviadas fe on fe.produto = fp.produto AND fp.seq = fe.sequencia
            WHERE fe.id is null and fp.link is not null  
            `  
    }

    /**
     * 
     * @param publicDatabase banco de dados publico. 
     * @param product codigo produto.
     * @returns obtem as fotos dos produtos do ERP.
     */
     async getPhotosByProduct(publicDatabase: string , product:number ){
        const sql = ` 
            SELECT 
            FROM ${publicDatabase}.fotos_prod  
            WHERE PRODUTO = ?   
            ` ;
            const [resultPhotos] = await this.connection.query(sql, [ product]);
            return resultPhotos as TabelFotosProd[]
    }

           /**
     * 
     * @param publicDatabase banco de dados publico. 
     * @param id id do registro.
     * @returns obtem as fotos dos produtos do ERP.
     */
     async getPhotosByid(publicDatabase: string , id:number ){
        const sql = ` 
            SELECT 
            FROM ${publicDatabase}.fotos_prod  
            WHERE id = ?   
            ` ;
            const [resultPhotos] = await this.connection.query(sql, [ id]);
            return resultPhotos as TabelFotosProd[]
    }

}
