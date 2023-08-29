import { NextPage } from 'next';

import Evaluations, { Evaluation } from '../../../../components/StudentProgram/Evaluations/Evaluations';
import { useState } from 'react';

const EvaluationPage: NextPage = () => {
    const [dataEvaluations, setDataEvaluations] = useState<Evaluation[]>([]);
    
    return (
        <>
            <Evaluations dataEvaluations={dataEvaluations} objectivesMode={false}/>
        </>
    )
};

export default EvaluationPage;