import { Box, Flex } from '@chakra-ui/react';
import { Grid, Card, Metric, Icon, Text, Button, Title, BarChart, AreaChart, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@tremor/react';
import { NextPage } from 'next';
import { AcademicCapIcon, MapIcon, UserGroupIcon, ArrowRightCircleIcon, EyeIcon } from "@heroicons/react/24/solid";

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

interface newRegistrations {
    id: number;
    name: string;
    lastname1: string;
    lastname2: string;
    address: string;
    phoneNumber: string;
}

const registrations: newRegistrations[] = [
    {
        id: 1,
        name: "Aaron",
        lastname1: "David",
        lastname2: "Rosario",
        address: "San Francisco",
        phoneNumber: "123",
    },
    {
        id: 2,
        name: "John",
        lastname1: "David",
        lastname2: "Rosario",
        address: "San Francisco",
        phoneNumber: "123",
    },
    {
        id: 3,
        name: "Misael",
        lastname1: "David",
        lastname2: "Rosario",
        address: "San Francisco",
        phoneNumber: "123",
    },
    {
        id: 1,
        name: "Aaron",
        lastname1: "David",
        lastname2: "Rosario",
        address: "San Francisco",
        phoneNumber: "123",
    },
    {
        id: 2,
        name: "Aaron",
        lastname1: "David",
        lastname2: "Rosario",
        address: "San Francisco",
        phoneNumber: "123",
    },
    {
        id: 3,
        name: "Aaron",
        lastname1: "David",
        lastname2: "Rosario",
        address: "San Francisco",
        phoneNumber: "123",
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
                                <Text>Campamentos Planificados</Text>
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
                    <Card className="h-96 overflow-hidden">
                        <Title>Inscripciones Recientes</Title>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell className="text-right">Nombre</TableHeaderCell>
                                    <TableHeaderCell className="text-right">Apellidos</TableHeaderCell>
                                    <TableHeaderCell className="text-right">Direccion</TableHeaderCell>
                                    <TableHeaderCell className="text-right">Telefono</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {registrations.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell className="text-right">
                                            <Text>{item.name}</Text>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Text>{item.lastname1} {item.lastname2}</Text>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Text>{item.address}</Text>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Text>{item.phoneNumber}</Text>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                        <div className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white pt-12 pb-8 absolute rounded-b-lg">
                            <Button
                                icon={EyeIcon}
                                className="bg-white shadow-md border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
                                iconPosition='right'
                            >
                                Ver más
                            </Button>
                        </div>
                    </Card>
                </div>
            </Box>
        </>
    )
}

export default Dashboard;