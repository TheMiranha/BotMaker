const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
    var a = new MessageEmbed();
    const queue = client.distube.getQueue(message)
    if (!queue){
        a.setColor('RED');
        a.setDescription('Não há nada tocando');
        a.setTitle("Ops...");
        message.channel.send({embeds: [a]});
        return;
    }
    const volume = parseInt(args[0])
    if (isNaN(volume)) {
        a.setColor('RED');
        a.setDescription('Insira um número válido!');
        message.channel.send({embeds: [a]});
        return;
    }
    queue.setVolume(volume)
    a.setColor('BLUE');
    a.setDescription('Volume alterado para: ' + volume);
}