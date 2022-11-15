const botconfig = require("/Users/eirikhanasand/Desktop/personal/quizbot/botconfig.json");
const Discord = require("discord.js");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = botconfig.mongourl;

module.exports.run = async (bot, message, args) => {
  let soonembed = new Discord.RichEmbed()
  .setDescription("[!longestlb] Coming soon!")
  .setColor("#f4ff4c");
  message.channel.send(soonembed);

  return;
  MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, client) {
    assert.equal(null, err);
    console.log("MongoDB successfully connected to scoreboard.js.");
    const db = client.db("QuizData");
    const dbc = db.collection("Points");

    const gtop = dbc.find( { entries: { $gt: 0 }})
    await gtop.each(async (err, doc) => {
      const gtopdocs = await doc
        if (err) {console.log(err)}
        else {
          console.log(doc)
          
          if (gtop < 1) {
            return;
          } else {
            const gtopawaited = await gtopdocs;
            //await message.channel.send(`Hello there ${gtopawaited}`)
            let Gembed = new Discord.RichEmbed()
            .setDescription(`Global toppliste [Rangert etter lengste quiz uten pause]`)
            .setColor("#00ff00")
            .addField("Riktige svar - Navn", `${gtopawaited.longest} - ${gtopawaited.name}`)
            .setFooter("Du ser nå statistikk over spillerne som har svart på flest spørsmål uten pause (!longestlb).\nPrøv !leaderboard, !pointslb, !entrieslb, streaklb, !correctlb og wronglb også.");

            message.channel.send(Gembed);
          }
        }
    }
    )})
};

module.exports.help = {
    name: "longestlb"
}