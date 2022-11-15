/*
TO BE UPDATED
*/
const botconfig = require("/Users/eirikhanasand/Desktop/personal/quizbot/botconfig.json")
const Discord = require("discord.js");
const quiz = require("/Users/eirikhanasand/Desktop/personal/quizbot/quiz.json");
const assert = require('assert');
const url = botconfig.mongourl;
const MongoClient = require('mongodb').MongoClient;

module.exports.run = async (bot, message, args) => {

//  CONNECT TO MONGODB DATABASE
    MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, client) {
        assert.equal(null, err);
        console.log("MongoDB successfully connected.");
        const db = client.db("QuizData");
        const dbc = db.collection("Points");
        const fstopid = {"id" : "stopid"};
        const fstopfind = await dbc.findOne(fstopid);

//      THIS IF ELSE CHAIN IS FOR RESETTING THE UNANSWERED COUNTER EACH TIME THE COMMAND IS CALLED.
        if(fstopfind) {
            dbc.updateOne(
                {"id" : "stopid"},
                { $set: { "recentActivity" : "Updated"} }
            )
        } else {
            dbc.insertOne({
                "id": "stopid",
                quiz: "Score",
                recentActivity: "Created",
                unanswered: 0
        })
        }

//      QUESTION LOOP
        for (let i = 1; i < 1000; i++) {
            const stopid = {"id" : "stopid"};
            const stopfind = await dbc.findOne(stopid);
            console.log(`${stopfind.unanswered}`)

/*          IF AT LEAST ONE OF THE LAST TWO QUESTIONS HAVE RECIEVED ONE OR MORE ANSWERS, EXECUTE THE IF STATEMENT. 
            IF NOT, EXECUTE THE ELSE STATEMENT. */ 
            if (await stopfind.unanswered < 999999) {
                const authid = {"id" : message.author.id}
                const authfind = await dbc.findOne(authid);
                //const attempts = new Array(quiz.attempt);
                const item = quiz[Math.floor(Math.random()*quiz.length)];
                const filter = response => {
                return item.answers.some(answers => answers.toLowerCase() === response.content.toLowerCase());
                };

                let qembed1 = new Discord.RichEmbed()
                    .setDescription(`*Kategori* \n \n **${item.question}** \n **A:** ${item.alt1} \n **B:** ${item.alt2} \n **C:** ${item.alt3} \n **D:** ${item.alt4} \n \n Skriv en bokstav, eller hele svaret! \n Svaret vil bli avsørt om 15 sekunder.`)
                    .setColor("#3B98FA");
                await message.channel.send(qembed1);

                const collected = await message.channel.awaitMessages(filter, { max: 1, time: 15000 });
                
//              CREATING A DOCUMENT FOR THE !QUIZ MESSAGE AUTHOR TO KEEP TRACK OF THEIR STATISTICS ON THE BOT
                if(authfind) {
                    dbc.updateOne(
                        {"id" : message.author.id},
                        { $set: { "recentActivity" : "Updated" }}
                        )
                } else {
                    dbc.insertOne({
                        "name": message.author.username,
                        "id": message.author.id,
                        quiz: "Score",
                        recentActivity: "Created",
                        entries: 0, 
                        correct: 0,
                        wrong: 0,
                        points: 0,
                        streak: 0,
                        longest: 0,
                        tags: ["score"]
                    });
                };

                console.log(`collected: ${collected.first()}`);

//              IF NO ANSWERS WERE COLLECTED THIS WILL BE FOUND TRUE, AND THE UNANSWERED COUNTER WILL BE INCREASED BY ONE.
                if(collected.size === 0) {
                    let NAembed = new Discord.RichEmbed()
                        .setDescription(`Ingen svar funnet, skriv **A**, **B**, **C** eller **D** for å svare`)
                        .setColor("#f4ff4c")
                        .setFooter("Riktig svar vises kun når du har gjettet.")
                        
                    message.channel.send(NAembed);

//                  IF STOPFIND (THE UNANSWERED TRACKING DOCUMENT) EXISTS INCREASE THE UNANSWERED COUNTER BY ONE.
                    if(stopfind) {
                        dbc.updateOne(
                            {"id" : "stopid"},
                            { $set: { "recentActivity" : "Updated"  } }
                        )
//                  IF STOPFIND (THE UNANSWERED TRACKING DOCUMENT) COUNTER EQUALS 1, INCREASE THE UNANSWERED COUNTER BY ONE.
                    } else if (stopfind = 1){
                        dbc.updateOne(
                            {"id" : "stopid"},
                            { $set: { "recentActivity" : "Updated"  } }
                        )
//                  IF STOPFIND (THE UNANSWERED TRACKING DOCUMENT) DOES NOT EXIST, THEN CREATE IT AND SET THE UNANSWERED COUNTER TO ONE.
                    } else {
                        dbc.insertOne({
                            "id": "stopid",
                            quiz: "Score",
                            recentActivity: "Created",
                            unanswered: 0
                    })
                    }

//              IF SOMEONE ANSWERED A QUESTION SET STOPFIND (THE UNANSWERED TRACKING DOCUMENT) TO 0.
                } else {
                    if (stopfind) {
                        dbc.updateOne(
                        {"id" : "stopid"},
                        { $set: { "recentActivity" : "Updated"} }
                        )   
                    }
            
                    const firstcoll = (collected.first() && collected.first().author);
                    const collid = {"id" : collected.first().author.id};
                    const collfind = await dbc.findOne(collid);
                    
/*                  IF THE FIRST PERSON TO ANSWER CORRECTLY ALREADY HAS A DOCUMENT, INCREASE THE ENTRIES AND CORRECT COUNTERS BY 1, 
                    AND THE POINTS COUNTER BY 10*/                  
                    if (firstcoll && collfind){
                        dbc.updateOne(
                            {"id" : collected.first().author.id},
                            { $set: { "recentActivity" : "Updated"  }, $inc: { "entries" : 1, "correct" : 1, "points" : 10 } }
                        )

                        let Aembed = new Discord.RichEmbed()
                            .setDescription(`${collected.first().author} riktig! ${item.answer}`)
                            .setColor("#00e600")
                            .setFooter(`La til 10 poeng. Du har totalt ${collfind.points + 10} poeng`)
                        message.channel.send(Aembed);

/*                  IF THE FIRST PERSON TO ANSWER CORRECTLY DOES NOT HAVE A DOCUMENT, CREATE IT, AND SET THE ENTRIES AND CORRECT COUNTERS 
                    TO 1, AND THE SCORE COUNTER TO 10*/                
                    } else if (firstcoll){
                        dbc.insertOne({
                            "name": collected.first().author.username,
                            "id": collected.first().author.id,
                            quiz: "Score",
                            recentActivity: "Created",
                            entries: 1, 
                            correct: 1,
                            wrong: 0,
                            points: 10,
                            streak: 1,
                            longest: 0,
                            tags: ["score"],
                        })

                        let Aembed = new Discord.RichEmbed()
                            .setDescription(`${collected.first().author} riktig! ${item.answer}`)
                            .setColor("#00e600")
                            .setFooter(`La til 10 poeng. Du har totalt 10 poeng`);
                        message.channel.send(Aembed);
                    
/*                  IF NO ONE ANSWERS CORRECTLY, BUT THE PERSON(S) WHO ANSWERED WRONG ALREADY HAS/HAVE A DOCUMENT, 
                    INCREASE THE ENTRIES AND WRONG COUNTERS BY 1*/                  
                    } else if (collfind) {
                        dbc.updateOne(
                            {"id" : collected.first().author.id},
                            { $set: { "recentActivity" : "Updated"  }, $inc: { "entries" : 1, "wrong" : 1 } }
                        )

                        let Fembed = new Discord.RichEmbed()
                            .setDescription(`Ingen hadde riktig. ${item.answer}`)
                            .setColor("#F72C00");
                            
                        message.channel.send(Fembed);

/*                  IF NO ONE ANSWERS CORRECTLY, AND THE PERSON(S) WHO ANSWERED WRONG DOES HAVE A DOCUMENT, 
                    CREATE IT AND SET THE WRONG AND THE ENTRIES COUNTER TO 1*/                  
                    } else {
                        dbc.insertOne({
                            "name": collected.first().author.username,
                            "id": message.author.id,
                            quiz: "Score",
                            recentActivity: "Created",
                            entries: 1, 
                            correct: 0,
                            wrong: 1,
                            points: 0,
                            streak: 0,
                            longest: 0,
                            tags: ["score"],
                        })

                        let Fembed = new Discord.RichEmbed()
                            .setDescription(`Ingen hadde riktig. ${item.answer}`)
                            .setColor("#F72C00");                        
                        message.channel.send(Fembed);
                }
                console.log('Run ' + i)
                await new Promise(r => setTimeout(r, 3000));
            }

//          IF THE LAST TWO QUESTIONS HAVE NOT BEEN ANSWERED, SAY THIS IN THE CHANNEL WHERE IT WAS USED, THEN STOP THE LOOP.
            } else {
                let Sembed = new Discord.RichEmbed()
                        .setDescription(`Quizzen ble automatisk stoppet siden ingen har svart på de to siste spørsmålene.`)
                        .setColor("#F72C00")
                        .setFooter("Skriv !quiz for å starte en ny quiz.")                        
                    message.channel.send(Sembed);
                return;
            }
        }
    }
    )
    };

/*
FOR THE COMMAND HANDLER, THE NAME VARIABLE IS THE !NAME USED TO CALL THE FILE. 
IN THIS CASE IT WOULD BE !quiz. 
*/ 
module.exports.help = {
    name: "permquiz"
}