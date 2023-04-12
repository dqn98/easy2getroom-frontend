import { User } from './user';

export class Message {
    id: number;
    connectionid: string;
    senderId: string;
    sender: User;
    recipientId:string;
    recipient: User;
    content: string;
    status: string;
    isRead: boolean;
    isGroup?: boolean;
    isMultiple?: boolean;
    isPrivate?: boolean;
    dateRead: Date;
    messageSent: Date;
}