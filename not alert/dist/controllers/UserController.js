"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_1 = require("express");
const UserService_1 = require("../services/UserService");
class UserController {
    async getAllUsers(req, res) {
        try {
            const users = await UserService_1.UserService.getAllUsers();
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' + error });
        }
    }
    async getByid(req, res) {
        try {
            const id = parseInt(req.params.id);
            const user = await UserService_1.UserService.getUserById(id);
            if (user) {
                res.json(user);
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' + error });
        }
    }
    async create(req, res) {
        try {
            const userData = req.body;
            const newUser = await UserService_1.UserService.createUser(req.body);
            res.status(201).json(newUser);
        }
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' + error });
        }
    }
    async update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const userData = req.body;
            const updatedUser = await UserService_1.UserService.updateUser(id, req.body);
            if (updatedUser) {
                res.json(updatedUser);
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' + error });
        }
    }
    async delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const deleted = await UserService_1.UserService.deleteUser(id);
            if (deleted) {
                res.status(204).send();
            }
            else {
                res.status(404).json({ message: 'User not found' });
            }
        }
        catch (error) {
            res.status(500).json({ message: 'Internal Server Error' + error });
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map