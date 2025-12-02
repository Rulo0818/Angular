"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const data_source_1 = require("../config/data-source");
const User_1 = require("../entities/User");
const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
exports.UserService = {
    async getAllUsers() {
        return await userRepository.find();
    },
    async getUserById(id) {
        return await userRepository.findOneBy({ id });
    },
    async createUser(userData) {
        const user = userRepository.create(userData);
        return await userRepository.save(user);
    },
    async updateUser(id, userData) {
        const user = await userRepository.findOneBy({ id });
        if (!user) {
            return null;
        }
        userRepository.merge(user, userData);
        return await userRepository.save(user);
    },
    async deleteUser(id) {
        const result = await userRepository.delete(id);
        return result.affected !== 0;
    }
};
//# sourceMappingURL=UserService.js.map