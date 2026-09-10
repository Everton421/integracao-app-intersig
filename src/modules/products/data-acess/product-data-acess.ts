import { type ResultSetHeader, type  Pool } from "mysql2/promise";
import { type table_enviados } from "../../../contracts/table-enviados.ts";
import { type dataProductErpForShipping } from "../interfaces/data-product-erp-for-shipping.ts";
import { type dataTableMappProduct } from "../interfaces/data-table-mapp-product.ts";


export class ProductDataAcess { 
    private connection :Pool

    constructor(connection: Pool){
        this.connection = connection; 
    }

    /**
     * 
     * @param publicDatabase banco de dados PUBLICO.
     * @param code Parametro opcional, caso preenchido a função ira buscar os dados do produto.
     * @returns 
     */
    async  searchProductErp(publicDatabase:string, code?:number ){
          const baseSql = ` SELECT  
                               p.CODIGO codigo,  
                               0 as estoque, 
                               COALESCE(   ROUND(pp.preco,2 ),  0.00 ) as preco,
                               COALESCE( p.GRUPO, 0) as grupo, 
                               p.CONTR_LOTE_SERIE as controle_lote_serie,
                               COALESCE(und.SIGLA,'UND') as unidade_medida,
                               p.DESCRICAO descricao, 
                               COALESCE(p.NUM_FABRICANTE, '') num_fabricante,
                               COALESCE(p.NUM_ORIGINAL ,'') num_original,
                               COALESCE(p.OUTRO_COD, '') sku,
                               COALESCE( p.MARCA, 0) as marca,
                               COALESCE(p.ATIVO, 'S') as  ativo,
                               p.TIPO tipo,
                               COALESCE(cf.NCM , '0000.00.00') as class_fiscal,
                               p.ORIGEM origem,
                               p.CST cst,
                               p.outro_cod2 ,
                               coalesce(DATE_FORMAT(p.DATA_CADASTRO, '%Y-%m-%d'),'0000-00-00 00:00:00') AS data_cadastro,
                               COALESCE( CONVERT( p.OBSERVACOES1 USING utf8), '')  as observacoes1,
                               COALESCE( CONVERT(p.OBSERVACOES2 USING utf8),'' ) as observacoes2,
                               COALESCE( CONVERT(p.OBSERVACOES3 USING utf8), '') as observacoes3
                          FROM   ${publicDatabase}.cad_prod p 
                                  left join  ${publicDatabase}.prod_tabprecos pp on pp.produto = p.codigo
                                  left join  ${publicDatabase}.tab_precos tp on tp.codigo = pp.tabela
                                  left join  ${publicDatabase}.class_fiscal cf on cf.codigo = p.class_fiscal
                                  left join  ${publicDatabase}.unid_prod und on und.produto = p.CODIGO and und.PADR_SAI = 'S' AND und.PADR_SEP= 'S'`;

                          let param = ` WHERE tp.padrao = 'S'
                              group by  p.CODIGO
                              order by p.CODIGO;`;
                          if(code && code != undefined){
                              param = `
                             WHERE  p.CODIGO = '${code}' AND tp.padrao = 'S'
                              group by  p.CODIGO
                              order by p.CODIGO;
                              `
                          } 
                          const sql = baseSql + param;
                              const [ rows ] = await this.connection.query(sql);
                          return rows as dataProductErpForShipping[];
        }

              
    async searchShippedProducts(mobileDatabase: string , search: Partial<table_enviados>){
            const {codigo_sistema, createdAt, id, id_mobile, updatedAt  } = search;

        const baseSql=`SELECT * FROM ${mobileDatabase}.produtos_enviados `;

        const searchParams=[]
        const valuesSearch=[]

              if(codigo_sistema) { 
                searchParams.push(' codigo_sistema = ? ');
                valuesSearch.push(codigo_sistema);
              }
              if(createdAt) { 
                searchParams.push(' createdAt = ? ');
                valuesSearch.push(createdAt);
              }
              if(id) { 
                searchParams.push(' id = ? ');
                valuesSearch.push(id);
              }
              if(id_mobile) { 
                searchParams.push(' id_mobile = ? ');
                valuesSearch.push(id_mobile);
              }
              if(updatedAt) { 
                searchParams.push(' updatedAt = ? ');
                valuesSearch.push(updatedAt);
              }
               const whereClause = ` WHERE `;
                
              const finalSql = baseSql + whereClause + searchParams.join(' AND ');
         
                 const [resultVerifyProduct] = await this.connection.query(finalSql, valuesSearch);
              return resultVerifyProduct as table_enviados[];
    }

    async InsertShippedProducts(mobileDatabase:string,  erpCodeProduct:number, mobileCode:number){
            const sql = `INSERT INTO ${mobileDatabase}.produtos_enviados set codigo_sistema = ? , id_mobile = ?`; 
            const values =[ erpCodeProduct , mobileCode]
                   const [resulInsert] = await this.connection.query(sql, values) ;
            return resulInsert as ResultSetHeader  
    }

async searchMappProducts(mobileDatabase: string  ){

        const sql=`SELECT * FROM ${mobileDatabase}.mapeamento_produtos  WHERE ID = 1;`;
                 const [resultVerifyProduct] = await this.connection.query(sql);
              return resultVerifyProduct as dataTableMappProduct[]; 
    }



        
}
