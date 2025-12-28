import type { IUser } from "./user.type";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
            };
            userDocument?: IUser;
        }
    }
}

export {};