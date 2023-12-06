import { ChatGateway } from "src/core/gateway/chat.gateway";
import { Notifications } from "src/db/entities/Notifications";
import { Repository } from "typeorm";
export declare class NotificationsService {
    private readonly notificationsRepo;
    private chatGateway;
    constructor(notificationsRepo: Repository<Notifications>, chatGateway: ChatGateway);
    getPagination({ pageSize, pageIndex, order, columnDef }: {
        pageSize: any;
        pageIndex: any;
        order: any;
        columnDef: any;
    }): Promise<{
        results: Notifications[];
        total: number;
    }>;
    markAsRead(notificationId: string): Promise<Notifications>;
    getUnreadByUser(userId: string): Promise<number>;
    test({ userId, title, description }: {
        userId: any;
        title: any;
        description: any;
    }): Promise<void>;
}
