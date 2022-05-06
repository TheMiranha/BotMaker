const { MessageEmbed } = require("discord.js");

exports.run = async (client, message) => {
  const queue = client.distube.getQueue(message);
  var a = new MessageEmbed();
  if (!queue) {
    a.setColor('RED');
    a.setDescription('Não há nada tocando');
    a.setTitle("Ops...");
    message.channel.send({embeds: [a]});
    return;
  }
  const q = queue.songs
      .map((song, i) => `${i === 0 ? 'Tocando:' : `${i}.`} ${song.name} - \`${song.formattedDuration}\``)
      .join('\n')
  a.setColor('BLUE');
  a.setDescription('Playlist: \n' + q);
  message.channel.send({embeds: [a]});
}