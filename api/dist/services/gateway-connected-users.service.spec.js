"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const gateway_connected_users_service_1 = require("./gateway-connected-users.service");
describe('GatewayConnectedUsersService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [gateway_connected_users_service_1.GatewayConnectedUsersService],
        }).compile();
        service = module.get(gateway_connected_users_service_1.GatewayConnectedUsersService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
//# sourceMappingURL=gateway-connected-users.service.spec.js.map