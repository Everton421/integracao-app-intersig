export type LoteSerieEventRequirement = {
    lote_serie: number;
    quantidade: number;
};

export type ItemEventRequirement = {
    produto: number;
    descricao: string;
    quantidade: number;
    custo: number | null;
    lotes_series: LoteSerieEventRequirement[];
};

export type EventRequirement = {
    codigo: number;
    data_requerimento: string;
    requerente: number;
    data_efetuacao: string;
    responsavel: number;
    pedido: number | null;
    setor_origem: number;
    setor_destino: number;
    historico: string;
    situacao: string;
    itens: ItemEventRequirement[];
};