import { OnModuleInit } from "@nestjs/common";
import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket } from "socket.io";
import { GoodsIssue } from "src/db/entities/GoodsIssue";
import { GoodsReceipt } from "src/db/entities/GoodsReceipt";
import { InventoryRequest } from "src/db/entities/InventoryRequest";
import { GatewayConnectedUsersService } from "src/services/gateway-connected-users.service";
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
    private gatewayConnectedUsersService;
    server: any;
    constructor(gatewayConnectedUsersService: GatewayConnectedUsersService);
    onModuleInit(): Promise<void>;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(socket: Socket): Promise<void>;
    private disconnect;
    reSync(type: string, data: any): Promise<void>;
    inventoryRequestChanges(userIds: string[], inventoryRequest: InventoryRequest): Promise<void>;
    goodsIssueChanges(userIds: string[], goodsIssue: GoodsIssue): Promise<void>;
    goodsReceiptChanges(userIds: string[], goodsReceipt: GoodsReceipt): Promise<void>;
    sendNotif(userIds: string[], title: string, description: any): Promise<void>;
}
