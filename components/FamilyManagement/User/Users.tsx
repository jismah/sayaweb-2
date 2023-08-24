export interface User{
    id: string;
    username: string;
    name: string;
    lastName1: string;
    lastName2: string | null;
    password: string;
    email: string;
    phone: string;
    role: string;

    idFamily: string;
}