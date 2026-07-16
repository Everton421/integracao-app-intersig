import test from "node:test"
import { insertMvto_produtos } from "../repository-movimentos.ts"

test("RepositoryMovimentosProduto", async (t)=>{
    await t.test("exec", async ()=>{
   const resultMvto =   await  insertMvto_produtos({
                                setor: 1,
                                produto: 1,
                                quantidade: 1,
                                unidade_medida: 'UND',
                                tipo: 'A',
                                historico: '',
                                usuario: 1,
                                ent_sai: 'E',
                                data_recadastro: '2026-07-16 16:9:15',
                                codigo: 13
                                })
    
            console.log(resultMvto)
                            })
})