const fs = require('fs');
const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

const inject = (client) => {
    client.distube = new DisTube(client, {
        searchSongs: 5,
        searchCooldown: 30,
        leaveOnStop: true,
        emitNewSongOnly: true,
        emitAddSongWhenCreatingQueue: false,
        plugins: [
            new SpotifyPlugin({emitEventsAfterFetching: true}),
            new SoundCloudPlugin(),
            new YtDlpPlugin(),
        ],
        youtubeDL: false
    });

    const status = queue => 
  `Volume: \`${queue.volume}%\` | Filtro: \`${queue.filters.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'Toda a playlist' : 'Apenas a música') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

  client.uteis = {status};

    fs.readdir('./apis/distube_events', (err, files) => {
        if (err) throw err;
        files.forEach(file => {
            let eventName = file.split('.')[0];
            const event = require(`./distube_events/${file}`);
            client.distube.on(eventName, (queue, song) => {
                event.run(client, queue, song);
            });
        });
    });

}

module.exports = {inject}