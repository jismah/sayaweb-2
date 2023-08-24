import { Student } from "../../Students/Students/Students";
import { Objective } from "../Objectives/Objectives";

export interface Program{
    id: string;
    description: string;
    maxStudents: number;
    inscription: number;
    montlyAmount: number;
    status: boolean;

    students: Student[];

    objectives: Objective[];
}

