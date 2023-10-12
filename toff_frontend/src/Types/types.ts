export interface BlogEntryItem {
    id: number;
    title: string;
    description: string;
    ticketLink?: string;
    imageSource?: string;
    archived: boolean;
    image?: File;
}