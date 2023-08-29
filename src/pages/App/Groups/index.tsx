import { NextPage } from 'next';
import Groups from '../../../../components/Groups/Groups/Group';

import {
    Card,
    Title,
    Tab,
    TabList,
    TabGroup,
    TabPanel,
    TabPanels,
  } from "@tremor/react";

import { Box } from '@chakra-ui/react';
import Shifts from '../../../../components/Groups/Shifts/Shifts';
import AcademicYears from '../../../../components/Campaments/AcademicYear/AcademicYear';

const GroupPage: NextPage = () => {
    return (
        <>
            <main>
                <Box px={3} py={3}>
                    <Card>
                        <Title>Grupos estudiantiles</Title>

                        <TabGroup className='mt-6'>
                            <TabList >
                                <Tab>Grupos</Tab>
                                <Tab>Tandas</Tab>
                                <Tab>Año académico</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Groups/>  
                                </TabPanel>
                                <TabPanel>
                                    <Shifts/>
                                </TabPanel>
                                <TabPanel>
                                    <AcademicYears/>
                                </TabPanel>
                            </TabPanels>
                        </TabGroup>
                    </Card>

                </Box>
            </main>
        </>
    )
};

export default GroupPage;