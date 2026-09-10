 
import { type dataProductErpForShipping } from "../interfaces/data-product-erp-for-shipping.ts";
import { type dataCreateProductMobile } from "../interfaces/data-create-product-mobile.ts";
import { type dataTableMappProduct } from "../interfaces/data-table-mapp-product.ts";

export class MappingProductShipping {

  /**
   * 
   * @param dataProductErp dados do produto a ser mapeado.
   * @param mappProductShipping dados do mapa para enviar produto
   */   
   mappingToShipping( dataProductErp:dataProductErpForShipping, mappProductShipping:  dataTableMappProduct  ): dataCreateProductMobile
    {

            const keyNumFabricante =  mappProductShipping.num_fabricante.toLocaleLowerCase();
            const keyNumoriginal = mappProductShipping.num_original.toLocaleLowerCase();
            const keySku = mappProductShipping.sku.toLocaleLowerCase();
            
            let valueNum_fabricanteToShipping = dataProductErp.num_fabricante; 
            let valueNum_originalToShipping = dataProductErp.num_original; 
            let valueSkuToShipping = dataProductErp.sku; 
              

                for(const key of Object.entries(dataProductErp) ){
                    //    console.log(key)
                     if(key[0] == keyNumFabricante ){
                            valueNum_fabricanteToShipping = key[1] as string;
                    }
                    if(key[0] == keyNumoriginal){
                            valueNum_originalToShipping =   key[1] as string;
                    }
                    if(key[0] == keySku){
                        valueSkuToShipping = key[1] as string;
                    }

                } 

           
         return {
            ativo: dataProductErp.ativo,
            caracteristica: 0,
            class_fiscal: dataProductErp.class_fiscal,
            controle_lote_serie: dataProductErp.controle_lote_serie,
            cst: dataProductErp.cst,
            descricao: dataProductErp.descricao,
            estoque: dataProductErp.estoque,
            fotos:[],
            grupo: Number(dataProductErp.grupo),
            id: String(dataProductErp.codigo),
            marca: Number(dataProductErp.marca),
            observacoes1: dataProductErp.observacoes1, 
            observacoes2: dataProductErp.observacoes2, 
            observacoes3: dataProductErp.observacoes3,
            origem: dataProductErp.origem,
            preco:String(dataProductErp.preco),
            tipo: Number(dataProductErp.tipo),
            unidade_medida: dataProductErp.unidade_medida,
            codigo: dataProductErp.codigo,
            num_fabricante: valueNum_fabricanteToShipping,
            num_original: valueNum_originalToShipping,
            sku: valueSkuToShipping
        }
         
    }

    
}