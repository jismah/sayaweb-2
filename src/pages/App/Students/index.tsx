import { NextPage } from 'next';
import React, { useState } from 'react';
import Students from '../../../../components/Students/Students/Students';

import { Student } from '../../../../components/Students/Students/Students';
import { Family } from '../../../../components/FamilyManagement/Family/Family';
import { User } from '../../../../components/FamilyManagement/User/Users';

const Student: NextPage = () => {

    const [familySiblings, setFamilySiblings] = useState<Student[]>([]);

    const [dataFamily, setDataFamily] = useState<Family>({
        id: "",
        name: "",
        students: [],
        parents: [],
        user: {} as User,
    });


    return (
        <>
            <Students
                familyStudents={familySiblings}
                dataFamily={dataFamily}
                familyMode={false}
                enableEditing={true}
                programMode={false}
            />
        </>
    )
};

export default Student;