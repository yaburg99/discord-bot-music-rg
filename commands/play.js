const {SlashCommandBuilder} = require("@discordjs/builders");
const{ EmbedBuilder } = require("discord.js");
const{QueryType} = require("discord-player");

module.exports ={
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Chơi một bài hát")
        .addSubcommand(subcommand=>
            subcommand
                .setName("search")
                .setDescription("đang tìm bài hát")
                .addStringOption(option =>
                    option
                        .setName("searchterms")
                        .setDescription("Đang tìm từ khóa")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("playlist")
                .setDescription("Nghe playlist từ Youtube !")
                .addStringOption(option=>
                    option
                        .setName("url")
                        .setDescription("Playlist URL")
                        .setRequired(true)
                )
            )
        .addSubcommand(subcommand=>
            subcommand
                .setName("song")
                .setDescription("Tìm một bài hát YT")
                .addStringOption(option =>
                    option
                        .setName("searchterms")
                        .setDescription("Tìm từ khóa")
                        .setRequired(true)
                )
            ),
        execute: async({client,interaction}) =>{
            if(!interaction.member.voice.channel)
            {
                await interaction.reply(" Bạn cần vào room nào đó để sử dụng lệnh");
                return;
            }

            const queue =await  client.player.createQueue(interaction.guild)
            
            if(!queue.connection) await queue.connect(interaction.member.voice.channel)

            let embed = new EmbedBuilder();
            if(interaction.options.getSubcommand()==="song")
            {
                let url = interaction.options.getString("url");

                const result = await client.player.search(url,{
                    requestedBy : interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO,
                });

                if(result.tracks.length === 0)
                {
                    await interaction.reply("Không tồn tại");
                    return
                }
                
                const song = result.tracks[0]
                await queue.addTrack(song);
                embed
                    setDescription(`Đã thêm **[${song.title}](${song.url})** vào hàng chờ`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({text:`Duration : ${song.duration}`});

            }
            else if(interaction.options.getSubcommand()==="playlist")
            {
                let url = interaction.options.getString("url");

                const result = await client.player.search(url,{
                    requestedBy : interaction.user,
                    searchEngine: QueryType.YOUTUBE_PLAYLIST,
                });

                if(result.tracks.length === 0)
                
                    return interaction.reply("Không có playlist tồn tại");
                    
                
                
                const playlist = result.playlist;
                await queue.addTracks(result.tracks);
                embed
                    setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** vào hàng chờ`)
                    .setThumbnail(playlist.thumbnail)
                    .setFooter({text:`Duration : ${playlist.duration}`});

            }
            else if(interaction.options.getSubcommand()==="search")
            {
                let url = interaction.options.getString("searchterms");

                const result = await client.player.search(url,{
                    requestedBy : interaction.user,
                    searchEngine: QueryType.AUTO,
                });

                if(result.tracks.length === 0)
                
                    return interaction.reply("Không tồn tại");
                
                
                
                const song = result.tracks[0];
                await queue.addTrack(song);
                embed
                    .setDescription(`Đã thêm **[${song.title}](${song.url})** vào hàng chờ`)
                    .setThumbnail(song.thumbnail)
                    .setFooter({text:`Duration : ${song.duration}`});

            }
            if(!queue.playing) await queue.play();

            await interaction.reply({
                embeds : [embed]
            })
        },
    }