import test from "node:test";
import { api } from "../../../services/api.ts";
import { isAxiosError } from "axios";
import assert from "node:assert";
import { CategoryRequest } from "../category-request.ts";



test('category-request', async (t) => {

     await t.test("CategoryRequest.post", async () => {
         const resultRequest = await  CategoryRequest.post({ 
                 ativo: 'S',
                 codigo: 1463,
                 data_cadastro: '2026-07-07',
                 data_recadastro: '2026-07-07 16:42:51',
                 descricao: 'categoria teste (1)',
                 id: '1463', 
             })
             console.log(resultRequest)
      assert.strictEqual(resultRequest.data?.codigo ,1463 )
 
     })

  
       await t.test("BrandRequest.put", async () => {
          const resultRequest = await  CategoryRequest.put(
            { 
                  ativo: 'S',
                  data_cadastro: '2026-07-07',
                  data_recadastro: '2026-07-07 16:42:51',
                  descricao: 'categoria teste (1)',
                  id: '1463', 
              }, 
              1463
             )
       assert.strictEqual(resultRequest.data?.codigo ,1463 )
      })
 
      
       await t.test("BrandRequest.delete", async () => {
          const resultRequest = await  CategoryRequest.delete( 1463 )
          console.log(resultRequest)
       assert.strictEqual(resultRequest.success ,true )
      })

     


})