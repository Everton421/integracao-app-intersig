import { type erpRequeriment, type loteSerieRequer,type prodRequer } from "./contracts/erpRequirement.ts"
import { type payloadRequestRequirement } from "./contracts/requeriment.ts"

export class RequerimentMapping{
     static mapping(erpRequeriment: erpRequeriment , prodErpRequeriment:prodRequer[], loteSerieRequer:loteSerieRequer[]) {
        return { 
            codigo:erpRequeriment.CODIGO,
            situacao: erpRequeriment.SITUACAO,
            data_efetuacao: erpRequeriment.DATA_EFETUACAO || '0000-00-00',
            historico: erpRequeriment.HISTORICO || '',
            requerente:  erpRequeriment.REQUERENTE,
            responsavel: erpRequeriment.RESPONSAVEL,
            setor_destino: erpRequeriment.DESTINO,
            setor_origem: erpRequeriment.ORIGEM,
            itens: prodErpRequeriment.map( ( product )=>{
                return { 
                    custo: product.CUSTO || 0,
                    descricao: product.DESCRICAO,
                    lotes_series:  loteSerieRequer.map( (loteserie)=>{
                       if(loteserie.PRODUTO == product.PRODUTO ) { return { 
                            lote_serie: loteserie.LOTE_SERIE,
                            quantidade: loteserie.QUANTIDADE
                            }
                        }
                    }),
                    produto: product.PRODUTO,
                    quantidade: product.QUANTIDADE
                }
            })
 
        } as payloadRequestRequirement
    }
}