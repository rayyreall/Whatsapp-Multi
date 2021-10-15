import { EventEmitter} from "events";
import { WASocket } from "@adiwajshing/baileys-md"

export declare class createEvents {
	getEvents: (event: EventEmitter, client: WASocket) => void;
	runScript: (event: EventEmitter, client: WASocket) => void;
}