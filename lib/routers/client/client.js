const { default: MakeWASocket, BufferJSON, initInMemoryKeyStore  } = require('@adiwajshing/baileys-md')
const fs = require("fs");
const chalk = require("chalk");
const { createEvents } = require("../../Base/handler.js");
const pino = require("pino")
const axios = require("axios")

module.exports = class createConnection {
	sock = undefined;
	constructor(account) {
		if (!account) account = "./lib/routers/account/sessions_default.json";
		this.run()
		this.handlerReconnect()
	}
	run = async () => {
		const sock = MakeWASocket({
			logger: pino({ level: 'fatal' }),
            auth: this.loadAuth(),
			printQRInTerminal: true
		})
		new createEvents(sock)
		return sock;
	}
	loadAuth = () => {
		let state =  undefined;
		try {
			const credential = JSON.parse(fs.readFileSync(this.account, { encoding: "utf8" }), BufferJSON.reviver)
			state  = {
				creds: credential.creds, 
                keys: initInMemoryKeyStore(credential.keys) 
			}
		} catch(err) {}
		return state;
	}
	getVersions = async () => {
		let respon
		try {
			const getData = await axios.get("https://web.whatsapp.com/check-update?version=1&platform=web")
			let Json = getData.data;
			respon = [Number(Json.currentVersion.split(".")[0]), Number(Json.currentVersion.split(".")[1]), Number(Json.currentVersion.split(".")[2])]
		} catch (err) {
			console.log(err)
			respon = [2, 2134, 10]
		}
		return respon
	}
	saveAuth = (state) => {
		console.info(chalk.yellow("Saving Sessions ..... "))
		state =  state || this.sock.authState;
		fs.writeFileSync(this.account,  JSON.stringify(state, BufferJSON.replacer, 2))
	}
	handlerReconnect = () => {
		this.sock = this.run();
		this.sock?.ev?.on("connection.update", (update) => {
			const { connection, lastDisconnect } = update
			if(connection === 'close') {
				if((lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut) {
					this.sock = this.run()
				} else {
					console.error(chalk.red("Koneksi Berhenti"))
				}
			}
			console.info(chalk.green("Menjalankan Koneksi"))
		})
		this.sock?.ev?.on("auth-state.update", () => this.saveAuth())
	}
}
