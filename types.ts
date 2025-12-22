export interface User {
    id: string;
    uid?: string; // Sometimes used interchangeably with id in this codebase
    name: string;
    email: string;
    createdAt: string;
    publicKey?: string | null;
    avatar?: string;
}
