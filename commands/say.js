const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let botmessage = args.join(" ");
        message.delete().catch();
        //message.channel.send(botmessage);
        message.channel.send("This feature is disabled for now.")
    
}

module.exports.help = {
    name: "say"
}