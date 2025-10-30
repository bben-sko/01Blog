

export interface Post {
    id: number;
    userId: number;
    username: string;
    content: string;
    imageUrl: string;
    status: string;
    createdAt: string;
    hiddenAt?: string;
    hiddenReason?: string;
}
