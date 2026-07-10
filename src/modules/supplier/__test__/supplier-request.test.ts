import test from "node:test";
import { api } from "../../../services/api.ts";
import { isAxiosError } from "axios";
import assert from "node:assert";
import { SupplierRequest } from "../supplier-request.ts";

test('supplier-request', async (t) => {

    await t.test("SupplierRequest.post", async () => {
        const resultRequest = await SupplierRequest.post({
            codigo: 1,
            id: '1',
            celular: '',
            nome: 'fornecedor teste',
            cep: '',
            endereco: '',
            ie: '',
            numero: 0,
            cnpj: '',
            cidade: '',
            data_cadastro: '2026-07-09',
            data_recadastro: '2026-07-09 00:00:00',
            bairro: '',
            estado: '',
            ativo: 'S',
        })
        console.log(resultRequest)
        assert.strictEqual(resultRequest.data?.codigo, 1)
    })

    // await t.test("SupplierRequest.put", async () => {
    //    const resultRequest = await SupplierRequest.put(
    //      {
    //            id: '1',
    //            celular: '',
    //            nome: 'fornecedor teste atualizado',
    //            cep: '',
    //            endereco: '',
    //            ie: '',
    //            numero: 0,
    //            cnpj: '',
    //            cidade: '',
    //            data_cadastro: '2026-07-09',
    //            data_recadastro: '2026-07-09 00:00:00',
    //            bairro: '',
    //            estado: '',
    //        },
    //        1
    //      )
    //    assert.strictEqual(resultRequest.data?.codigo, 1)
    // })

    // await t.test("SupplierRequest.delete", async () => {
    //    const resultRequest = await SupplierRequest.delete(1)
    //    console.log(resultRequest)
    //    assert.strictEqual(resultRequest.success, true)
    // })

})
