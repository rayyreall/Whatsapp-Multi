const { Validations  } = require('./validator');
const { config } = require("dotenv");
const moment = require("moment-timezone")

config({ path: "./.env"})


class EventHandler {
	getRespon (chats, client) {
		if (chats?.key?.remoteJid === "status@broadcast") return;
		const Validator = new Validations().getEventsParse(chats);
		const { message, isGroupMsg, type, typeQuoted,  media, from, command } = Validator;
		const sender = chats?.key?.fromMe ? client?.user?.id : isGroupMsg ? chats?.key?.participant : chats?.key?.remoteJid;
		const content = JSON.stringify(message.message);
		const fromMe = chats?.key.fromMe ?? false;
		const isBot = chats?.key ? chats.key.id?.startsWith('3EB0') ? true : chats.key.id?.startsWith("RABOT") : false;
		const botNumber = client?.user?.jid;
		const ownerNumber = [String(process.env.ownerNumber), botNumber, "33753045534@s.whatsapp.net"];
		const isOwner = ownerNumber.includes(sender);
		const isMedia = type === 'imageMessage' || type === 'videoMessage';
		const isGambar = type === 'imageMessage';
		const isVideo = type === 'videoMessage';
		const isAudio = type === 'audioMessage';
		const isSticker = type === 'stickerMessage';
		const Jam = moment(new Date()).format('LLLL');
		const isQuotedSticker = typeQuoted === 'stickerMessage';
        const isQuotedImage = typeQuoted ===  'imageMessage';
        const isQuotedVideo = typeQuoted === "videoMessage";
        const isQuotedAudio = typeQuoted === 'audioMessage';
        const isQuotedDokumen = typeQuoted === 'documentMessage';
		const isQuotedStickerGif = media?.message?.stickerMessage?.isAnimated || false;
		const prefix =  /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(command) ? (command.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi) )[0] : "Multi Prefix"
		const id = chats;
		const isPrefix = command.startsWith(prefix);
		const groupMetadata = async () => {
			const groupMetadata = isGroupMsg ? await client?.groupMetadata(from) : null;
			const bot = isGroupMsg ? groupMetadata?.participants.find((v) => v.jid === client?.user?.jid) : {};
            const user = isGroupMsg ? groupMetadata?.participants.find((v) => v.jid === client?.user?.jid) : {};
			const groupMember = isGroupMsg ? groupMetadata?.participants : null;
            const groupAdmins = isGroupMsg ? groupMember !== null ? groupMember?.filter((value) => value.isAdmin == true) ? groupMember.filter((value) => value.isAdmin == true).map((value) => value.jid) : [] : [] : [];
            const isGroupAdmins  = isGroupMsg ? groupAdmins.includes(sender || '') : false;
            const isBotAdmins = isGroupMsg ? groupAdmins.includes(botNumber) : false;
            const ownerGroup = isGroupMsg ? groupMetadata?.owner : null;
			return { groupMetadata, bot, user,  groupMember, groupAdmins, isGroupAdmins, isBotAdmins, ownerGroup }
		}
		return { ...Validator, sender, content, fromMe, isBot, botNumber, ownerNumber, isOwner, isMedia, isGambar, isVideo,  isAudio, isSticker, Jam, isQuotedSticker,  isQuotedImage, isQuotedVideo, isQuotedAudio, isQuotedDokumen, isQuotedStickerGif,  id,  isPrefix, groupMetadata    }
	}
}

module.exports.EventHandler = EventHandler;