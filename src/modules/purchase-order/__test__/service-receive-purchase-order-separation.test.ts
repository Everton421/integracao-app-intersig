import test from "node:test";
import { UpdatePurchaseOrderSeparation } from "../service-receive-purchase-order-separation.ts";

 

test("UpdatePurchaseOrderSeparation" , async ( t )=>{
   
    await t.test("updateErpOrder ", async ()=>{
        const resultUpdateSalesOrder = await UpdatePurchaseOrderSeparation.updateErpOrder( { pedido :20, tipo :6, situacao_separacao: 'I', itens_processados :1, series_registradas :1})
        console.log(resultUpdateSalesOrder);
    })

})