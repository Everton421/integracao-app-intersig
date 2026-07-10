import test from "node:test";
import { api } from "../../../services/api.ts";
import { isAxiosError } from "axios";
import assert from "node:assert";
import { CustomerRequest } from "../customer-request.ts";

test('customer-request', async (t) => {
    await t.test("CustomerRequest.post", async () => {
        const resultRequest = await CustomerRequest.post({ 
            codigo: 1463,
            id: '1463',
            celular: '',
            nome: 'cliente teste',
            cep: '',
            endereco: '',
            ie: '',
            numero: '',
            cnpj: '',
            cidade: '',
            data_cadastro: '2026-07-07',
            data_recadastro: '2026-07-07 16:42:51',
            vendedor: 0,
            bairro: '',
            estado: '',
        })
        console.log(resultRequest)
        assert.strictEqual(resultRequest.data?.codigo, 1463)
    })

    await t.test("CustomerRequest.put", async () => {
        const resultRequest = await CustomerRequest.put(
            { 
                celular: '',
                nome: 'cliente teste',
                cep: '',
                endereco: '',
                ie: '',
                numero: '',
                cnpj: '',
                cidade: '',
                data_cadastro: '2026-07-07',
                data_recadastro: '2026-07-07 16:42:51',
                vendedor: 0,
                bairro: '',
                estado: '',
                id: '1463', 
            }, 
            1463
        )
        assert.strictEqual(resultRequest.data?.codigo, 1463)
    })

    await t.test("CustomerRequest.delete", async () => {
        const resultRequest = await CustomerRequest.delete(1463)
        console.log(resultRequest)
        assert.strictEqual(resultRequest.success, true)
    })
})
