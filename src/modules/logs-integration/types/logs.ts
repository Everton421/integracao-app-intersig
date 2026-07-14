export interface Logs {
id:number
status: string
id_message: string
id_registro: number
dados_sql: string
json_payload: string
detalhes_erro: string
detalhes: string
tabela_origem: string
tipo_evento: 'INSERT' | 'UPDATE' | 'DELETE'
criado_em:string

}