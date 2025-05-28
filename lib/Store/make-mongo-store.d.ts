import type { Comparable } from "@adiwajshing/keyed-db/lib/Types";
import { Db } from "mongodb";
import type { Logger } from "pino";
import { proto } from "../../WAProto";
import type makeMDSocket from "../Socket";
import type { BaileysEventEmitter, Chat, ConnectionState, Contact, GroupMetadata, PresenceData, WAMessage, WAMessageCursor, WAMessageKey } from "../Types";
import { Label } from "../Types/Label";
import { LabelAssociation } from "../Types/LabelAssociation";
import { ObjectRepository } from "./object-repository";
type WASocket = ReturnType<typeof makeMDSocket>;
export declare const waChatKey: (pin: boolean) => {
    key: (c: Chat) => string;
    compare: (k1: string, k2: string) => number;
};
export declare const waMessageID: (m: WAMessage) => string;
export declare const waLabelAssociationKey: Comparable<LabelAssociation, string>;
export type CronJobConfig = {
    /**
     * Create crontab expressions from https://crontab.guru/
     */
    cronTime: string | Date;
    /**
     * Timezone of the cron job
     * @default "Asia/Jakarta"
     */
    timeZone?: string;
    onComplete?: Function;
};
export type BaileyesMongoStoreConfig = {
    chatKey?: Comparable<Chat, string>;
    labelAssociationKey?: Comparable<LabelAssociation, string>;
    socket?: WASocket;
    logger?: Logger;
    /**
     * You can set it to not save chats without messages.
     *
     * Use this filter to identify unsaved chat types in your current databse.
     *
     *     	{ $and: [
     * 					{ 'messages.message.messageStubType': { $exists: true } },
     * 					{ 'messages.message.message': { $exists: true } }
     * 				]
     * 		}
     *
     */
    filterChats?: boolean;
    /**
     * Cron job to delete status message. Set to false to disable
     *
     * Deletes all status messages older than 24 hours on At 00:00 (default)
     * @default config {cronTime: "0 0 * * *", timeZone: "Asia/Jakarta"}
     */
    autoDeleteStatusMessage: boolean | CronJobConfig;
    db: Db;
};
declare const _default: ({ logger: _logger, socket, db, filterChats, autoDeleteStatusMessage, }: BaileyesMongoStoreConfig) => {
    chats: import("mongodb").Collection<Chat>;
    contacts: import("mongodb").Collection<Contact>;
    messages: {
        [_: string]: {
            array: proto.IWebMessageInfo[];
            get: (id: string) => proto.IWebMessageInfo | undefined;
            upsert: (item: proto.IWebMessageInfo, mode: "append" | "prepend") => void;
            update: (item: proto.IWebMessageInfo) => boolean;
            remove: (item: proto.IWebMessageInfo) => boolean;
            updateAssign: (id: string, update: Partial<proto.IWebMessageInfo>) => boolean;
            clear: () => void;
            filter: (contain: (item: proto.IWebMessageInfo) => boolean) => void;
            toJSON: () => proto.IWebMessageInfo[];
            fromJSON: (newItems: proto.IWebMessageInfo[]) => void;
        };
    };
    groupMetadata: {
        [_: string]: GroupMetadata;
    };
    state: ConnectionState;
    presences: {
        [id: string]: {
            [participant: string]: PresenceData;
        };
    };
    labels: ObjectRepository<Label>;
    labelAssociations: import("mongodb").Collection<LabelAssociation>;
    bind: (ev: BaileysEventEmitter) => void;
    /** loads messages from the store, if not found -- uses the legacy connection */
    loadMessages: (jid: string, count: number, cursor: WAMessageCursor) => Promise<proto.IWebMessageInfo[]>;
    /**
     * Get all available labels for profile
     *
     * Keep in mind that the list is formed from predefined tags and tags
     * that were "caught" during their editing.
     */
    getLabels: () => ObjectRepository<Label>;
    /**
     * Get labels for chat
     *
     * @returns Label IDs
     **/
    getChatLabels: (chatId: string) => Promise<import("mongodb").WithId<LabelAssociation> | null>;
    /**
     * Get labels for message
     *
     * @returns Label IDs
     **/
    getMessageLabels: (messageId: string) => Promise<import("mongodb").FindCursor<string>>;
    loadMessage: (jid: string, id: string) => Promise<proto.IWebMessageInfo | undefined>;
    mostRecentMessage: (jid: string) => Promise<proto.IWebMessageInfo>;
    fetchImageUrl: (jid: string, sock: WASocket | undefined) => Promise<string | null | undefined>;
    getContactInfo: (jid: string, socket: WASocket) => Promise<Partial<Contact> | null>;
    fetchGroupMetadata: (jid: string, sock: WASocket | undefined) => Promise<GroupMetadata>;
    fetchMessageReceipts: ({ remoteJid, id }: WAMessageKey) => Promise<proto.IUserReceipt[] | null | undefined>;
    getChatById: (jid: string) => Promise<Chat | null>;
    toJSON: () => {
        chats: import("mongodb").Collection<Chat>;
        contacts: import("mongodb").Collection<Contact>;
        messages: {
            [_: string]: {
                array: proto.IWebMessageInfo[];
                get: (id: string) => proto.IWebMessageInfo | undefined;
                upsert: (item: proto.IWebMessageInfo, mode: "append" | "prepend") => void;
                update: (item: proto.IWebMessageInfo) => boolean;
                remove: (item: proto.IWebMessageInfo) => boolean;
                updateAssign: (id: string, update: Partial<proto.IWebMessageInfo>) => boolean;
                clear: () => void;
                filter: (contain: (item: proto.IWebMessageInfo) => boolean) => void;
                toJSON: () => proto.IWebMessageInfo[];
                fromJSON: (newItems: proto.IWebMessageInfo[]) => void;
            };
        };
        labels: ObjectRepository<Label>;
        labelAssociations: import("mongodb").Collection<LabelAssociation>;
    };
    fromJSON: (json: {
        chats: Chat[];
        contacts: {
            [id: string]: Contact;
        };
        messages: {
            [id: string]: WAMessage[];
        };
        labels: {
            [labelId: string]: Label;
        };
        labelAssociations: LabelAssociation[];
    }) => Promise<void>;
};
export default _default;
