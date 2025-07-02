"use strict";
// Since we can't generate Prisma client due to network issues,
// let's create a mock implementation for now
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClient = void 0;
class PrismaClient {
    constructor() {
        this.user = {
            findUnique: (params) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                // Mock implementation - in real app, this would query the database
                // For demo purposes, return a mock user if email is test@example.com
                if (((_a = params.where) === null || _a === void 0 ? void 0 : _a.email) === 'test@example.com') {
                    return {
                        id: 1,
                        name: 'Test',
                        lastName: 'User',
                        email: 'test@example.com',
                        password: '$2a$12$example.hash', // This would be a real hash
                        phone: '1234567890',
                        role: 'USER',
                        status: 'ACTIVE',
                        emailVerified: true,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                }
                return null;
            }),
            create: (params) => __awaiter(this, void 0, void 0, function* () {
                // Mock implementation
                return {
                    id: Math.floor(Math.random() * 1000),
                    name: params.data.name,
                    lastName: params.data.lastName || null,
                    email: params.data.email,
                    password: params.data.password,
                    phone: params.data.phone || null,
                    role: 'USER',
                    status: params.data.status || 'PENDING',
                    emailVerified: false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
            }),
            update: (params) => __awaiter(this, void 0, void 0, function* () {
                // Mock implementation
                return Object.assign({ id: params.where.id, name: 'Updated Name', lastName: 'Updated LastName', email: 'updated@example.com', password: 'updated_password', phone: '1234567890', role: 'USER', status: params.data.status || 'ACTIVE', emailVerified: params.data.emailVerified !== undefined ? params.data.emailVerified : true, createdAt: new Date(), updatedAt: new Date() }, params.data);
            })
        };
    }
}
exports.PrismaClient = PrismaClient;
