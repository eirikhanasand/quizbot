const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
        let embed = new Discord.RichEmbed()
        .setColor("#F72C00")
        .addField("Bot stopped", "Admin has stopped the bot.")
        message.channel.send(embed)
        console.log("Bot force stopped by admin using !stop.")
        await new Promise(r => setTimeout(r, 500));
        process.exit();
    }
    
module.exports.help = {
    name: "stop"
}