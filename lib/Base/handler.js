const { EventHandler } = require("./parseEvent")
const { Clients } = require("../routers/client/cli")
const { format } = require("util")
const { Command } = require("./command")
const { PemujaCase } = require("../pemuja_case_disini/main")

class createEvents {
	constructor() {
	}
	getEvents = (events, client) => {
		events.on("chat-update", (chats) => events.emit("create-chats", new EventHandler().getRespon(chats, client)))
	}
	runScript = (events, clients) => {
		events.on("create-chats", async (message) => {
			if (!message) return
			const { from, isOwner, command, args, id, sender } = message;
			const Cli = new Clients(clients, message)
			global.client = new Command()
			global.client.getEventsDetector(clients, message, Cli)
			global.client.on("eval", async (data, cli) => {
					try {
						console.log("masuk")
						const Ev = format(eval(`(async () => {
							${args?.join(" ")}
						})()`))
						await Cli.sendText(data.from,Ev)
					} catch (err) {
						console.log(err)
					}
			}, { events: ["eval"], command: ["=>"], tag: "owner", isOwner: true})
			if (message.isBot) return;
			PemujaCase()
			return void (client.waitEventsUpdate(clients, message, Cli));
		})
	}
}
module.exports.createEvents = createEvents