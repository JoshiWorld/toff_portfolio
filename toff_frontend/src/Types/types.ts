export interface BlogEntryItem {
    id: number;
    title: string;
    description: string;
    ticketLink?: string;
    imageSource?: string;
    archived: boolean;
    image?: File;
    isVideo: boolean;
    mediaSource: string;
    media?: File;
}

export interface StatsItem {
    id: number;
    title: string;
    value?: number;
    goal?: number;
    color?: string;
    percentageString?: string;
}

export interface Email {
    id: number;
    email: string;
    password: string;
    isActive: boolean;
}
