import { User } from "../entities/User";
export declare const UserService: {
    getAllUsers(): Promise<User[]>;
    getUserById(id: number): Promise<User | null>;
    createUser(userData: {
        firstname: string;
        lastname: string;
        age: number;
    }): Promise<User>;
    updateUser(id: number, userData: {
        firstname?: string;
        lastname?: string;
        age?: number;
    }): Promise<User | null>;
    deleteUser(id: number): Promise<boolean>;
};
//# sourceMappingURL=UserService.d.ts.map