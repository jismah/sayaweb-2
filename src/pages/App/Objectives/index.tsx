import { NextPage } from 'next';

import Objectives, { Objective } from '../../../../components/StudentProgram/Objectives/Objectives';
import { useState } from 'react';

const ObjectivesPage: NextPage = () => {
    const [dataObjectives, setDataObjectives] = useState<Objective[]>([]);
    
    return (
        <>
            <Objectives dataObjectives={dataObjectives} programMode={false}/>
        </>
    )
};

export default ObjectivesPage;