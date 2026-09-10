import { type ResultSetHeader } from "mysql2";
import dbConn, { MOBILE } from "../connection/database-connection.ts";
import { sqlTables } from "../structure/tables.ts";


async function verifyConfigMappingProduct(){
    const [dataConfigMappingProduct] = await dbConn.query(`SELECT * FROM ${MOBILE}.mapeamento_produtos where id = 1;`)
    const configMappingProduct =  dataConfigMappingProduct as any[];
    if(!configMappingProduct.length ){
      await dbConn.query( `INSERT INTO  ${MOBILE}.mapeamento_produtos  ( id , num_fabricante , num_original , sku ) VALUES (1,'num_fabricante','num_original','sku' );`);
    }

}  

export async function seed( ) {
    for( const i of sqlTables){

        try{
        const [rows ] = await dbConn.query(i as string) ;
        const result = rows as ResultSetHeader;
          if( result.affectedRows > 0 ) console.log(result);
        }catch(e){
            console.log(e)
            continue;
        }
    }
 
        await verifyConfigMappingProduct()

}

   
await seed();