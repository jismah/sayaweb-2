import { NextPage } from 'next';
import React, { useState } from 'react';

import { Family } from '../../../../components/FamilyManagement/Family/Family';
import { User } from '../../../../components/FamilyManagement/User/Users';
import Parents, { Parent } from '../../../../components/Students/Parents/Parents';

const ParentPage: NextPage = () => {

    const [familyHeaders, setFamilyHeaders] = useState<Parent[]>([]);

    const [dataFamily, setDataFamily] = useState<Family>({
        id: "",
        name: "",
        students: [],
        parents: [],
        user: {} as User,
    });


    return (
        <>
            <Parents
                dataFamily={dataFamily}
                familyMode={false}
                enableEditing={true}
                familyParents={familyHeaders} 
            />
        </>
    )
};

export default ParentPage;