import { Objective } from "../Objectives/Objectives";

export interface Evaluation{
    id: string;
    date: string;
    comment: string | null;

    objectives: Objective[];
    idStudent: string;
}