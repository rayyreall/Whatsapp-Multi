const { EventHandler } = require("./parseEvent")
const { Clients } = require("../routers/client/cli")
const { format } = require("util")

class createEvents {
	constructor() {
	}
	getEvents = (events, client) => {
		events.on("chat-update", (chats) => events.emit("create-chats", new EventHandler().getRespon(chats, client)))
	}
	runScript = (events, client) => {
		events.on("create-chats", async (message) => {
			if (!message) return
			const { from, isOwner, command, args, id, sender } = message;
			const Cli = new Clients(client, message)
			if (!isOwner) return
			// Kalo Mau tes tes aja disini w belom buat command e
			//btw gw blom check client nya kalo error lapor aja
			switch(command) {
				case "=>":
				try {
					const Ev = format(eval(`(async () => {
						${args?.join(" ")}
					})()`))
					await client.sendMessage(from, { text: Ev})
				} catch (err) {
					console.log(err)
					client.sendMessage(from, { text: err})
				}
				break
			}
		})
	}
}
module.exports.createEvents = createEvents