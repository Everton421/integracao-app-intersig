import amqplib from 'amqplib';

/**
 * 
 * @param domain dominio a ser consultado. Ex: pedido.atualizado, produto.atualizado
 * @param exec função que recebera a mensagem e fará o processamento
 */

const RECONNECT_DELAY = 5000;

export async function consumerMobile(domain: string, exec:( message:any )=> Promise<{success:boolean, message:string | null }> , ack: boolean) {

  const BROKER_URL_MOBILE = process.env.BROKER_URL_MOBILE;
  const BASE_QUEUE_NAME_MOBILE = process.env.QUEUE_NAME_MOBILE
  const CNPJ = process.env.CNPJ;
  const EXCHANGE_NAME = process.env.EXCHANGE_NAME_MOBILE!
  const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

  if (!BASE_QUEUE_NAME_MOBILE || !CNPJ || !EXCHANGE_NAME) {
    throw new Error("Verificar variaveis de ambiente [ BASE_QUEUE_NAME, CNPJ,  EXCHANGE_NAME] ");
  }

  const uniqueQueueName = `${BASE_QUEUE_NAME_MOBILE}_${domain.replace(/\./g, '_')}`;
  const routingKey = `tenant.${CNPJ}.${domain}`

  async function startConsumer() {

    const conn = await amqplib.connect(BROKER_URL_MOBILE!);
    const channel = await conn.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true })
    const q = await channel.assertQueue(uniqueQueueName, { durable: true });

    await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);

    console.log(`[*] Worker iniciado na fila [${uniqueQueueName} ] ouvindo  ${routingKey}`);

    channel.prefetch(1);

    await channel.consume(q.queue, async (msg) => {
      if (msg) {
        try {
          console.log(`[*] Mensagem recebida...  `);
          let conteudo = JSON.parse(msg.content.toString());


          if (conteudo.metadata.origin != origin) {

            console.log(`[v] Mensagem recebida  em [${uniqueQueueName}]  | Key: ${msg.fields.routingKey} | origin : ${conteudo.metadata.origin}`);
            const resultExecFunction =  await exec(conteudo.data);

            if (ack) {
                channel.ack(msg)
              }
          } else {

            if (conteudo.metadata.origin == origin) {
              console.log(`[X] A mensagem não será processada, pois possui a origem ${conteudo.metadata.origin} `)
              channel.ack(msg)
            }

          }

        } catch (e) {
          console.log("[x] Erro ao processar a mensagem: ", e)
        }
      }
    }, { noAck: false });

    conn.on('error', (err) => {
      console.error(`[!] Erro na conexão RabbitMQ (${domain}): ${err.message}`);
    });

    conn.on('close', () => {
      console.warn(`[!] Conexão RabbitMQ (${domain}) perdida. Reconectando em ${RECONNECT_DELAY / 1000}s...`);
      setTimeout(startConsumer, RECONNECT_DELAY);
    });

    channel.on('error', (err) => {
      console.error(`[!] Erro no channel RabbitMQ (${domain}): ${err.message}`);
    });
  }

  await startConsumer();

}
