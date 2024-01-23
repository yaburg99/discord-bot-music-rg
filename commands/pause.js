const {SlashCommandBuilder} = require("@discordjs/builders");
const{MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Đã dừng bài nhạc"),
    execute: async({client, interaction}) =>{
        const queue = client.player.getQueue(interaction.guild);

        if(!queue){
            await interaction.reply("Không có bài nhạc nào đang chạy");
            return;
        }
        
        queue.setPaused(true);

        await interaction.reply("Đã dừng nhạc")
    }
}