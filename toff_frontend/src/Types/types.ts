export interface BlogEntryItem {
    id: number;
    title: string;
    description: string;
    ticketLink?: string;
    imageSource?: string;
    archived: boolean;
    image?: File;
}

export interface StatsItem {
    id: number;
    title: string;
    value?: number;
    goal?: number;
    color?: string;
}
