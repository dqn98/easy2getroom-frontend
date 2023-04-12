export class Comment {
    id: number;
    userId: string;
    propertyId: number;
    sortOrder: number;
    title: string;
    content: string;
    ratingStart: number;
    parentId?: number;
    likeCount: number;
    dateCreated: Date;
    dateModified: Date;
}