const botconfig = require("/Users/eirikhanasand/Desktop/personal/quizbot/botconfig.json");
const Discord = require("discord.js");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = botconfig.mongourl;

module.exports.run = async (bot, message, args) => {
  MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, client) {
    assert.equal(null, err);
    console.log("MongoDB successfully connected.");
    const db = client.db("QuizData");
    const dbc = db.collection("Points");

        const authid = {"id" : message.author.id}
        const authfind = await dbc.findOne(authid);
        const stat = authfind.correct / authfind.entries;
        const statres = 100 * stat;
        const fixedstatres = statres.toFixed([2]);
        let Pembed = new Discord.RichEmbed()
        .setDescription(`Statistikk for ${message.author}`)
        .setColor("#00ff00")
        .addField("Poeng Totalt", `${authfind.points}`, true)
        .addField("Prosent Riktig", `${fixedstatres}%`, true)
        .addBlankField()
        .addField("Spørsmål besvart", authfind.entries, true)
        .addField("Riktige Svar", authfind.correct, true)
        .addField("Feil Svar", authfind.wrong, true);

        message.channel.send(Pembed);
      })
};

module.exports.help = {
    name: "score"
}