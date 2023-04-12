export class MessageViewModel {
    connectionid: string;
    senderId: string;
    recipientId:string;
    content: string;
    status: string;
    isRead: boolean;
    isGroup?: boolean;
    isMultiple?: boolean;
    isPrivate?: boolean;
    dateRead: Date;
    messageSent: Date;
}