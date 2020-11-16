require('dotenv').config();
const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const Database = require('@replit/database');
const db = new Database();
const { get } = require('axios');
const express = require('express');
const app = express();

// npm install dotenv discord.js @replit/database axios express

app.get('/', (req, res) => { res.send('Online') });
const list = app.listen(3000, () => { console.log(`[PORT] ${list.address().port}`) });

let success = 0;
let errors = 0;
setInterval(async () => {
    await db.list().then(async (keys) => {
        for (let key of keys)
            await db.get(key).then(value => {
                get(value).then(() => {
                    success++;
                    console.log(`S[${success}] E[${errors}] | Ping [${value}]`);
                }).catch((err) => {
                    errors++;
                    console.log(`S[${success}] E[${errors}] | Error Ping [${value}]\n${err}`);
                });
            });
    });
}, process.env.TIME * 60 * 1000);

client.on('message', async (message) => {
    const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;

    if (cmd === 'add') {
        if (message.member.id !== process.env.ADMIN) return message.channel.send(`❌ | ${message.member}, você não tem permissão para usar esse comando!`).then(msg => { msg.delete({ timeout: 7000 }).catch(() => { }) });
        const link = args[0];
        if (!link) return message.channel.send(`❌ | ${message.member}, você esqueceu de adicionar o link!`).then(msg => { msg.delete({ timeout: 7000 }).catch(() => { }) });
        if (!link.includes('http')) return message.channel.send(`❌ | ${message.member}, esse link não é válido!`).then(msg => { msg.delete({ timeout: 7000 }).catch(() => { }) });

        try {
            message.delete().catch(() => { });
            await db.set(link.slice('https://'.length), link);
            return message.channel.send(`✅ | ${message.member}, \`\`${link}\`\` foi adicionado com sucesso!`).then(msg => { msg.delete({ timeout: 10000 }).catch(() => { }) });
        } catch (err) {
            message.delete().catch(() => { });
            return message.channel.send(`❌ | ${message.member}, ocorreu um erro ao adicionar esse link!\n\`\`\`css\n${err}\`\`\``).then(msg => { msg.delete({ timeout: 15000 }).catch(() => { }) });
        };
    };

    if (cmd === 'remove') {
        if (message.member.id !== process.env.ADMIN) return message.channel.send(`❌ | ${message.member}, você não tem permissão para usar esse comando!`).then(msg => { msg.delete({ timeout: 7000 }).catch(() => { }) });
        const link = args[0];
        if (!link) return message.channel.send(`❌ | ${message.member}, você esqueceu de adicionar o link!`).then(msg => { msg.delete({ timeout: 7000 }).catch(() => { }) });

        if (!await db.get(link)) return message.channel.send(`❌ | ${message.member}, não encontrei \`\`${link}\`\` no meu banco de dados!`).then(msg => { msg.delete({ timeout: 7000 }).catch(() => { }) });

        try {
            message.delete().catch(() => { });
            await db.delete(link);
            return message.channel.send(`✅ | ${message.member}, \`\`${link}\`\` foi removido com sucesso!`).then(msg => { msg.delete({ timeout: 10000 }).catch(() => { }) });
        } catch (err) {
            message.delete().catch(() => { });
            return message.channel.send(`❌ | ${message.member}, ocorreu um erro ao remover esse link!\n\`\`\`css\n${err}\`\`\``).then(msg => { msg.delete({ timeout: 15000 }).catch(() => { }) });
        };
    };

    if (cmd === 'list') {
        try {
            db.list().then(keys => {
                const mapa = keys.map((k, i) => `${i + 1} | ${k}`).join('\n');
                const embed = new MessageEmbed()
                    .setColor(3092790)
                    .setDescription(`\`\`\`${mapa.length === 0 ? `Banco de dados vazio\nDigite ${process.env.PREFIX}add [link]` : mapa}\`\`\`\nPara remover digite **${process.env.PREFIX}remove** com uma das opções acima!`)
                return message.channel.send(message.member, embed);
            });
        } catch (err) {
            message.delete().catch(() => { });
            return message.channel.send(`❌ | ${message.member}, ocorreu um erro ao mostrar a lista de links\n\`\`\`css\n${err}\`\`\``).then(msg => { msg.delete({ timeout: 15000 }).catch(() => { }) });
        };
    };
    
    if (cmd === 'help') {
        const admin = client.users.cache.get(process.env.ADMIN) || await client.users.fetch(process.env.ADMIN, true) || 'Desconhecido';
        const avatar = admin.avatarURL({ format: 'png', dynamic: true, size: 4096 }) || admin.displayAvatarURL({ format: 'png', dynamic: true, size: 4096 }) || '';

        const embed = new MessageEmbed()
            .setColor(3092790)
            .addField('**Comandos**', `\`\`\`\n${process.env.PREFIX}add\n${process.env.PREFIX}remove\n${process.env.PREFIX}list\`\`\``)
            .setFooter(`Administrador: ${admin.tag}`, avatar)
        return message.channel.send(message.member, embed);
    };

});

client.login(process.env.TOKEN).then(() => {
    console.log(`[LOGIN] Bot logado ${client.user.username}`);
}).catch((err) => {
    console.log(`[LOGIN] Erro ao logar\n${err}`);
});
