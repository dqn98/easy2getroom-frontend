export class CommentViewModel {
    id: number;
    author: any;
    parentId?: number;
    content: string;
    date: Date;
    childs: CommentViewModel[];
}