import { NextPage } from 'next';

import Programs from '../../../../components/StudentProgram/Programs/Programs';
import Objectives, { Objective } from '../../../../components/StudentProgram/Objectives/Objectives';
import Evaluations, { Evaluation } from '../../../../components/StudentProgram/Evaluations/Evaluations';
import { useState } from 'react';

const Program: NextPage = () => {
    const [dataObjectives, setDataObjectives] = useState<Objective[]>([]);
    const [dataEvaluations, setDataEvaluations] = useState<Evaluation[]>([]);
    
    return (
        <>
            <Programs/>

            <Objectives dataObjectives={dataObjectives} programMode={false}/>

            <Evaluations dataEvaluations={dataEvaluations} objectivesMode={false}/>

        </>
    )
};

export default Program;