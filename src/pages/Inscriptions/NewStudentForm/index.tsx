import { NextPage } from "next";
import StudentForm from "../../../../components/Inscriptions/StudentForm/StudentForm";
import { Student } from "../../../../components/Students/Students/Students";

import { User } from "../../../../components/FamilyManagement/User/Users";

import { Family } from "../../../../components/FamilyManagement/Family/Family";
import { useState } from "react";

const StudentFormPage: NextPage = () => {
      const initialStudentData: Student = {
        id: "",
        name: "",
        lastName1: "",
        lastName2: "",
        housePhone: "",
        address: "",
        status: "",
        commentary: "",
        medicalCondition: "",
        progressDesired: "",
        allowedPictures: false,
        dateBirth: "",
        idPediatrician: "",
        idCity: "",
        idProgram: "",
        idFamily: "", 
        idParent: "",
      };

      const initialFamilyData: Family = {
        id: "",
        name: "",
        students: [],
        parents: [],
        user: {} as User,
      };
    
      //Datos de Familia
      const [dataFamily, setDataFamily] = useState<Family>(initialFamilyData)

    return (
        <>
          <StudentForm dataParents={dataFamily.parents} dataStudent={initialStudentData} editingMode={false} createStudentWithFamily={false}/>  
        </>
    )
};

export default StudentFormPage;