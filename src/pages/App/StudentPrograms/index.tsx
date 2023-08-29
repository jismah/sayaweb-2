import { NextPage } from 'next';

import Programs from '../../../../components/StudentProgram/Programs/Programs';

import {
    Card,
    Grid,
    Title,
    Text,
    Tab,
    TabList,
    TabGroup,
    TabPanel,
    TabPanels,
  } from "@tremor/react";
import Objectives, { Objective } from '../../../../components/StudentProgram/Objectives/Objectives';
import Evaluations, { Evaluation } from '../../../../components/StudentProgram/Evaluations/Evaluations';
import { useState } from 'react';
import { Box } from '@chakra-ui/react';

const ProgramPage: NextPage = () => {
    const [dataObjectives, setDataObjectives] = useState<Objective[]>([]);
    const [dataEvaluations, setDataEvaluations] = useState<Evaluation[]>([]);


    return (
        <>
            <main>
                <Box px={3} py={3}>
                    <Card>
                        <Title>Programas estudiantiles</Title>

                        <TabGroup className='mt-6'>
                            <TabList>
                                <Tab>Programas</Tab>
                                <Tab>Objetivos</Tab>
                                <Tab>Evaluaciones</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Programs/>
                                </TabPanel>
                                <TabPanel>
                                    <Objectives dataObjectives={dataObjectives} programMode={false}/>
                                </TabPanel>
                                <TabPanel>
                                    <Evaluations dataEvaluations={dataEvaluations} objectivesMode={false}/>
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    </Card>

                </Box>
            </main>
        
        </>
    )
};

export default ProgramPage;