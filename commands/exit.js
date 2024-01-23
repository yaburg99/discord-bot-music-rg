const {SlashCommandBuilder} = require("@discordjs/builders");
const{MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("exit")
        .setDescription("Đã bị sút khỏi trái đất"),
    execute: async({client, interaction}) =>{
        const queue = client.player.getQueue(interaction.guild);

        if(!queue){
            await interaction.reply("Không có bài nhạc nào đang chạy");
            return;
        }
        
        queue.destroy();

        await interaction.reply("Tại sao lại đuổi anh 6");
    }
}