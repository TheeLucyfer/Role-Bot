import Discord from 'discord.js'
import fs from 'fs'
import util from 'util'
import {roles, devRoles} from './roles.mjs'

const client = new Discord.Client();

const writeFilePromise = util.promisify(fs.writeFile)
const readFilePromise = util.promisify(fs.readFile)

let config;
let messageID;

//Displays a message in the terminal once the bot is online/ready
client.once('ready', async() => {
	console.log('Ready!');
	try {
		messageID = await readFilePromise("messageID.txt")
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
	if (messageReaction.message.id != messageID){
	return;
	}

	if (user === client.user) return

	const guild = messageReaction.message.guild;
	const member = await guild.members.fetch(user.id);

	for (let index = 0; index < devRoles.length; index++) {
		const role = devRoles[index];
		
		
	}
})