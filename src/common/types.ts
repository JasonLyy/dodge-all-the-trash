import { Message, MessageEmbed } from 'discord.js';

export interface TrashSummary {
    playerName?: string;
    region?: string;
    comments?: TrashComments[];
}

export interface TrashComments {
    comment: string;
    reportedBy: string;
}

export interface Report {
    comment?: string;
    player_name: string;
    player_name_stripped: string;
    region: string;
    report_timestamp: Date;
    reported_by: string;
}

export interface MessageProcessor {
    (message: Message): Promise<void>;
}

export interface TrashGetter {
    (players: string[]): Promise<MessageEmbed[]>;
}
