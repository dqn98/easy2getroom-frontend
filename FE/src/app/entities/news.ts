import { User } from './user';
import { NewsImage } from './newsImage';

export class News {
    id: number;
    title: string;
    content: string;
    userId: string;
    dateCreated: Date;
    dateModified: Date;
    user: User;
    newsImages: NewsImage[];
}