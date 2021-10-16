const {  downloadContentFromMessage  } = require("@adiwajshing/baileys-md")
const fs = require("fs");
const crypto = require("crypto");
const { fromBuffer } = require("file-type");
const got = require('got')

class Clients {
	clients = undefined;
	data = undefined;
	constructor (clients, data){
		this.clients = clients;
		this.data = data;
	};
	async sendText (from, text) {
		return await this.clients?.sendMessage(from, { text: text })
	}
	async reply(from, text, id) {
		return await this.clients?.sendMessage(from, { text: text }, { quoted: id })
	}
	async RegUrl (Link) {
		return Link?.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
	}
	async getBuffer (Link) {
		const data = await got(Url, {
			method: 'GET',
			headers: {
				'user-agent': UserAgent(),
				...options
			} 
		}).buffer()
		return data
	}
	async sendFile (from, media, _settings = { isDocs: false, caption: "", ptt: false }) {
		try {
			if (Buffer.isBuffer(media) || (typeof media === "string" && fs.existsSync(media)) || (typeof media === "string" && this.RegUrl(media))) {
				media = Buffer.isBuffer(media) ? media : fs.existsSync(media) ? fs.readFileSync(media) : await this.getBuffer(this.RegUrl(media)[0])
				const fileType = await fromBuffer(media);
				let Metadata;
				switch (_settings.isDocs ? "docs" : fileType?.ext) {
					case "docs":
					       Metadata = { document: media, mimetype: fileType?.mime }
					break;
					case "gif":
					       Metadata = { video: media, caption: _settings.caption,  gifPlayback: true }
					break
					case "mp4":
					case "mkv":
					case "m4a":
					case "m4p":
					case "m4v":
					      Metadata = { video: media, caption: _settings.caption }
					break
					case "mp3":
					      Metadata = { audio: media, mimetype: fileType?.mime,  ptt: _settings.ptt }
					break;
					case "webp":
					     Metadata = { sticker: media }
					break
					case "png":
					case "jpg":
					     Metadata = { image: media }   
					break	 
				}
				return await this.clients.sendMessage(from, Metadata, { ..._settings })
			}
		} catch (err) {
			throw err
		}
	}
	async decryptMedia (media, save, path) {
		let GetTypes = Object.keys(media.message)[0];
		let Type = undefined;
		switch(GetTypes) {
			case "imageMessage": {
				Type = "image"
			}
			break
			case "videoMessage": {
				Type = "video"
			}
			break
			case "stickerMessage": {
				Type = "sticker"
			}
			break
			case "audioMessage": {
				Type = "audio"
			}
			break
			case "documentMessage": {
				Type = "document"
			}
			break
		}
		if (!Type) throw new Error("Type Macam apa ini")
		const Stream = await downloadContentFromMessage(media.message[GetTypes], Type)
		let buff = Buffer.from([])
		for await (const chunk of Stream) {
			buff = Buffer.concat([buff, chunk])
		}
		let Path = crypto.randomBytes(32).toString()
		if (save) {
			fs.writeFileSync(path || Path, buff)
			return Path
		} else {
			return buff
		}
	}
}




module.exports.Clients = Clients;