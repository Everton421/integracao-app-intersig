import { ProdSectorDataAcess } from "../data-acess/prod-sector-data-acess.ts";
import { type message_prod_setor } from "../interfaces/message-prod-setor.ts";

export class ReceiveProdSector{

        private prodSectorDataAcess : ProdSectorDataAcess;
            private ESTOQUE:string;

        constructor( prodSectorDataAcess : ProdSectorDataAcess, ESTOQUE:string){
            this.prodSectorDataAcess = prodSectorDataAcess;
                this.ESTOQUE =ESTOQUE;
        }

    async recebiveByEvent (event:message_prod_setor ): Promise<{success:boolean, message:string | null }>{
        try {
                     const resultUpdateProdSector = await this.prodSectorDataAcess.updateProdSector({
                estoque: Number(event.estoque),
                local1_produto: event.local1_produto,
                local2_produto: event.local2_produto,
                local3_produto: event.local3_produto,
                local4_produto: event.local4_produto,
                local_produto:event.local_produto,
                produto: event.produto,
                setor: event.setor
            }
                , this.ESTOQUE)

                return { success: true, message:''};
        } catch (error) {
                return { success: false, message:String(error)};
        }                 


    }
}