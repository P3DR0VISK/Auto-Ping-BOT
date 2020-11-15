# Um Bot de [Discord](https://discord.com/) feito para manter projetos online
- **Esse projeto usa a versão 12.4.1 do [Discord.js](https://discord.js.org)**
- **E utilizar o banco de dados da [repl.it](https://repl.it/)**
- **O código pode apresentar erros porque sou um iniciante, então fique a vontade para modificá-lo**

|Comandos|Quem pode usar|
|---|---|
|Help|Todos|
|List|Todos|
|Add|Admin|
|remove|Admin|

- **Novos comandos? Aceito sugestões!

# Instalação
Antes de tudo crie um arquivo **.env** e coloque dentro desse arquivo as seguintes coisas abaixo:
```js
 TOKEN= //Coloque o token do bot
 TIME=5  //De quantos em quantos minutos o bot vai pingar
 PREFIX=! //O prefixo do bot
 ADMIN=71248129712824234 //E o ID da pessoa que poderá usar os comandos
```
### Depois use
```
npm install dotenv discord.js @replit/database axios express
```
### E adicione a URL do seu projeto da [repl.it](https://repl.it/) em um site de monitoramento
**Sugestões**
- **[BetterUptime](https://betteruptime.com/)**
- **[FreshPing](https://www.freshworks.com/website-monitoring/login/)**
- **[UptimeRobot](https://uptimerobot.com/)**
## Com Webhook [Não é necessário]
```
Adicionando um webhook para enviar as mensagens que são enviadas no console direto em um canal de texto do Discord
```
Primeiro adicione mais duas coisinhas dentro do arquivo **.env**
```js
 WEBHOOKID= // ID do webhook
 WEBHOOKTOKEN= // Token do webhook
```
Depois substitui a parte do código de ping para essa
```js
const { Client, MessageEmbed, WebhookClient } = require('discord.js');
const client = new Client();
const Webhook = new WebhookClient(process.env.WEBHOOKID, process.env.WEBHOOKTOKEN);

let success = 0;
let errors = 0;
setInterval(async () => {
    await db.list().then(async (keys) => {
        for (let key of keys)
            await db.get(key).then(value => {
                get(value).then(() => {
                    success++;
                    Webhook.send(`S[${success}] E[${errors}] | Ping [${value}]`);
                }).catch((err) => {
                    errors++;
                    Webhook.send(`S[${success}] E[${errors}] | Error Ping [${value}]\n${err}`);
                });
            });
    });
}, process.env.TIME * 60 * 1000);
```
