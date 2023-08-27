import { Objective } from "../Objectives/Objectives";

export interface Evaluation{
    id: string;
    date: string;
    comment: string | null;

    idStudent: string;
}