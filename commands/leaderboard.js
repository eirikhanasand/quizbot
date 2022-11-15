const botconfig = require("/Users/eirikhanasand/Desktop/personal/quizbot/botconfig.json");
const Discord = require("discord.js");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = botconfig.mongourl;

module.exports.run = async (bot, message, args) => {
  MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, client) {
    assert.equal(null, err);
    console.log("MongoDB successfully connected to scoreboard.js.");
    const db = client.db("QuizData");
    const dbc = db.collection("Points");

    const gtop = dbc.find( { entries: { $gt: 0 }})

    const Gembed = new Discord.RichEmbed()
            .setDescription(`Global toppliste [All statistikk, rangert etter poeng]\nPoeng | Besvarte | Lengste Streak | Uten Pause | Riktig | Feil`)
            .setColor("#00ff00")
            //.addField("Poeng | Besvarte | Lengste Streak | Uten Pause | Riktig | Feil | Navn", `${gtopawaited.points} | ${gtopawaited.entries} | ${gtopawaited.streak} | ${gtopawaited.longest} | ${gtopawaited.correct} | ${gtopawaited.wrong} | ${gtopawaited.name}`)
            .setFooter("Du ser nå den totale statistikkoversikten, rangert etter poeng (!leaderboard).\nPrøv !pointslb, !entrieslb, !streaklb, longestlb, !correctlb og !wronglb også.")

    await gtop.each(async (err, doc) => {
      const gtopdocs = await doc
        if (err) {console.log(err)}
        else {
          console.log(doc)
          
          if (gtop < 1) {
            return;
          } else {
            const gtopawaited = await gtopdocs;
            Gembed.addField(`${await gtopawaited.name}`, `${await gtopawaited.points}| ${await gtopawaited.entries} | ${await gtopawaited.streak} | ${await gtopawaited.longest} | ${await gtopawaited.correct} | ${await gtopawaited.wrong}`)          
          }
          
        }
    },
    console.log("Message sent!"),
    setTimeout(()=>message.channel.send(Gembed),100)
    );
  });
};

module.exports.help = {
    name: "leaderboard"
}