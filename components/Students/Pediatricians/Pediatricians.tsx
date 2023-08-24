
import { Student } from "../Students/Students";

export interface Pediatrician{
    id: string;
    name: string;
    medicalInstitution: string;
    officeNumber: string;
    phone: string;

    students: Student[];
}

export default function Pediatricians(){

}