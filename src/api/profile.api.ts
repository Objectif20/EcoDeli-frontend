import axiosInstance from "./axiosInstance";


export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    color?: EventColor;
    location?: string;
}

export type EventColor =
    | "sky"
    | "amber"
    | "violet"
    | "rose"
    | "emerald"
    | "orange";

export class ProfileAPI {
    static async getMyPlanning(): Promise<CalendarEvent[]> {
        const response = await axiosInstance.get<CalendarEvent[]>("/client/planning");
        return response.data;
    }

    static async createReport(message : string) : Promise<void> {
        await axiosInstance.post("/client/profile/report", { report_message : message });
    }
}
