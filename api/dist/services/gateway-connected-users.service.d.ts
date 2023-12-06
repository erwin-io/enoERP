import { GatewayConnectedUsers } from "src/db/entities/GatewayConnectedUsers";
import { Repository } from "typeorm";
export declare class GatewayConnectedUsersService {
    private readonly gatewayConnectedUsersRepo;
    constructor(gatewayConnectedUsersRepo: Repository<GatewayConnectedUsers>);
    findByUserId(userId?: string): Promise<GatewayConnectedUsers>;
    findByUserIds(userIds: string[]): Promise<{
        userId: string;
        socketId: string;
        unRead: string;
    }[]>;
    add({ userId, socketId }: {
        userId?: string;
        socketId?: string;
    }): Promise<GatewayConnectedUsers>;
    deleteByUserId(userId?: string): Promise<import("typeorm").DeleteResult>;
    deleteAll(): Promise<void>;
}
