export type dataCreateProductMobile = {
   codigo?: number,
   id: string,
   estoque: number,
   preco: string,
   unidade_medida: string,
   grupo: number,
   origem: string,
   descricao: string,
   num_fabricante: string,
   num_original: string,
   sku: string,
   marca: number,
   ativo: 'S' | 'N',
   class_fiscal: string,
   cst: string,
   caracteristica: number,
   controle_lote_serie:  'S' | 'N',
   observacoes1: string,
   observacoes2: string,
   observacoes3: string,
   tipo: number,
   fotos: fotosProduct[]
}
type fotosProduct = { 
    foto:string,
    sequencia: string
    descricao: string
    link: string
}