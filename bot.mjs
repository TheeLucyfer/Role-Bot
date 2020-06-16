import Discord from 'discord.js'
import fs from 'fs'
import util from 'util'
import {roles, devRoles} from './roles.mjs'

const client = new Discord.Client({
	partials:["MESSAGE", "REACTION"]
});
//Promisifies reading and writing to the files
const writeFilePromise = util.promisify(fs.writeFile)
const readFilePromise = util.promisify(fs.readFile)

let config;
let messageID;

//Displays a message in the terminal once the bot is online/ready
client.once('ready', async() => {
	console.log('Ready!');
	try {
		let messageIDBuffer = await readFilePromise("messageID.txt")
		messageID = messageIDBuffer.toString();
		console.log('Found old message', messageID)
	} catch (err) {
		
	}
});

//Logs in to the bot using the config token
fs.readFile('config.json', (err, data) => {
	config = JSON.parse(data);
	client.login(config.token);
});




client.on('message', async (message) => {
	if (message.member.id != "262852578465808386"){
		return;
	}
	if (message.content === '!ping') {
		var botMessage = await message.channel.send('Pong');
		messageID = botMessage.id;
		
		try {
			await writeFilePromise("messageID.txt", botMessage.id)
		} catch (err) {
			if (err)
				throw err;
		}

		botMessage.react('😄')
	}
});

client.on("messageReactionAdd", async (messageReaction, user) => {
	console.log(messageReaction.message.id, messageID)
	if (messageReaction.message.id != messageID){
		return;
	}

	if (user === client.user) return

	const guild = messageReaction.message.guild;
	const member = await guild.members.fetch(user.id);

	console.log("Checking user for roles in devRoles HEHEHE")

	console.log(devRoles['NA']);

	for (let location in devRoles) {
		console.log(`Checking if user has ${location}`);
		
		const role = devRoles[location];
		if (member._roles.includes(role.id)) {
			member.roles.add(role.comp)
			return;
		}
		
	}
})
