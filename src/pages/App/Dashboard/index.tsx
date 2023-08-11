import { Box, Flex } from '@chakra-ui/react';
import { Grid, Card, Metric, Icon, Text, Button, Title, BarChart, AreaChart } from '@tremor/react';
import { NextPage } from 'next';
import { AcademicCapIcon, MapIcon, UserGroupIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

const chartStudents = [
    {
        name: "Programa #1",
        "Estudiantes": 167,
    },
    {
        name: "Programa #2",
        "Estudiantes": 84,
    },
    {
        name: "Programa #3",
        "Estudiantes": 34,
    },
    {
        name: "Programa #4",
        "Estudiantes": 150,
    },
];

const chartNomina = [
    {
        date: "Jan 22",
        "Gasto": 82500,
    },
    {
        date: "Feb 22",
        "Gasto": 91530,
    },
    {
        date: "Mar 22",
        "Gasto": 99504,
    },
    {
        date: "Apr 22",
        "Gasto": 102000,
    },
    {
        date: "May 22",
        "Gasto": 143500,
    },
    {
        date: "Jun 22",
        "Gasto": 152500,
    },
];

const chartFormatterNomina = (number: number) => {
    return "$ " + Intl.NumberFormat("us").format(number).toString();
};

const dataFormatter = (number: number) => {
    return Intl.NumberFormat("us").format(number).toString();
};

const Dashboard: NextPage = () => {
    return (
        <>
            <Box p={4} width={'100%'}>
                <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
                    <Card>
                        <Flex justifyContent="start" className="space-x-4">
                            <Icon icon={UserGroupIcon} variant="light" size="xl" color={'slate'} />
                            <div className="truncate">
                                <Text>Estudiantes Activos</Text>
                                <Metric className="truncate">30</Metric>
                            </div>
                        </Flex>
                    </Card>

                    <Card>
                        <Flex justifyContent="start" className="space-x-4">
                            <Icon icon={AcademicCapIcon} variant="light" size="xl" color={'slate'} />
                            <div className="truncate">
                                <Text>Programas Activos</Text>
                                <Metric className="truncate">13</Metric>
                            </div>
                        </Flex>
                    </Card>

                    <Card>
                        <Flex justifyContent="start" className="space-x-4">
                            <Icon icon={MapIcon} variant="light" size="xl" color={'slate'} />
                            <div className="truncate">
                                <Text>Campamentos Activos</Text>
                                <Metric className="truncate">4</Metric>
                            </div>

                        </Flex>
                    </Card>
                </Grid>
                <div className="mt-6">
                    <Grid numItemsMd={1} numItemsLg={2} className="gap-6">
                        {/* CHART #1 */}
                        <Card>
                            <Title>Estudiantes En Programas</Title>
                            <BarChart
                                className="mt-6"
                                data={chartStudents}
                                index="name"
                                categories={["Estudiantes"]}
                                colors={["teal"]}
                                valueFormatter={dataFormatter}
                                yAxisWidth={20}
                            />
                        </Card>

                        {/* CHART #2 */}
                        <Card>
                            <Title>Gastos En Nómina Anual</Title>
                            <AreaChart
                                className="mt-4"
                                data={chartNomina}
                                index="date"
                                categories={["Gasto"]}
                                colors={["teal"]}
                                valueFormatter={chartFormatterNomina}
                            />
                        </Card>
                    </Grid>
                </div>
                <div className="mt-6">
                    <Card>
                        <Title>Inscripciones</Title>
                        <div className="h-80" />
                    </Card>
                </div>
            </Box>
        </>
    )
}

export default Dashboard;