import { Box, Flex } from '@chakra-ui/react';
import { Grid, Card, Metric, Icon, Text, Button, Title, BarChart, AreaChart, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell } from '@tremor/react';
import { NextPage } from 'next';
import { AcademicCapIcon, MapIcon, UserGroupIcon, ArrowRightCircleIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from 'react';
import router from 'next/router';
import { useUser } from '@supabase/auth-helpers-react'
import Link from 'next/link';


interface ChartDataNomina {
    date: string;
    Gasto: number;
}

interface newRegistrations {
    id: number;
    name: string;
    lastname1: string;
    lastname2: string;
    address: string;
    housePhone: string;
    dateBirth: string
}

const chartFormatterNomina = (number: number) => {
    return "$ " + Intl.NumberFormat("us").format(number).toString();
};

const dataFormatter = (number: number) => {
    return Intl.NumberFormat("us").format(number).toString();
};

// Función para transformar los datos en el formato deseado
const transformData = (data: any[]) => {
    return data.map(item => {
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        const date = `${monthNames[Number(item.month) - 1]} ${item.year}`;

        return {
            date,
            "Gasto": item.total,
        };
    });
};



const Dashboard: NextPage = () => {
    const user = useUser()
    const [studentKPI, setStudentKPI] = useState(0);
    const [programKPI, setProgramKPI] = useState(0);
    const [campKPI, setCampKPI] = useState(0);
    const [chartStudentsPerProgram, setChartStudentsPerProgram] = useState([]);
    const [chartNomina, setChartNomina] = useState<ChartDataNomina[]>([]);
    const [listInscriptions, setListInscriptions] = useState<newRegistrations[]>([]);


    /* FETCH PARA KPI's */
    const fetchKPIs = async () => {
        await fetch('https://sayaserver.onrender.com/api/graphs/counts', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "123456",
            },
        })
            .then(response => response.json())
            .then(data => {
                setStudentKPI(data.response.studentCount);
                setProgramKPI(data.response.programCount);
                setCampKPI(data.response.campCount);
            });
    }

    /* FETCH PARA CHART ESTUDIANTES POR PROGRAMAS */
    const fetchStudentsPerPrograms = async () => {
        await fetch('https://sayaserver.onrender.com/api/graphs/studentPrograms?cant=3', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "123456",
            },
        })
            .then(response => response.json())
            .then(data => {
                setChartStudentsPerProgram(data.response);
            });
    }

    /* FETCH PARA CHART NOMINA DE 1 AÑO */
    const fetchNomina = async () => {
        await fetch('https://sayaserver.onrender.com/api/graphs/nomina?cant=12', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "123456",
            },
        })
            .then(response => response.json())
            .then(data => {
                const formattedData = transformData(data.response);
                setChartNomina(formattedData);
            });
    }

    /* FETCH PARA LISTADO BREVE DE INSCRIPCIONES */
    const fetchListInscriptions = async () => {
        await fetch('https://sayaserver.onrender.com/api/graphs/recentInscriptions', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "123456",
            },
        })
            .then(response => response.json())
            .then(data => {
                setListInscriptions(data.response);
            });
    }

    useEffect(() => {
        if (user) {
            router.push('/Auth/Login');
        }

        fetchKPIs();
        fetchStudentsPerPrograms();
        fetchNomina();
        fetchListInscriptions();
    }, [user]);

    return (
        <>
            <Box p={4} width={'100%'}>
                <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
                    <Card>
                        <Flex justifyContent="start" className="space-x-4">
                            <Icon icon={UserGroupIcon} variant="light" size="xl" color={'slate'} />
                            <div className="truncate">
                                <Text>Estudiantes Activos</Text>
                                <Metric className="truncate">{studentKPI}</Metric>
                            </div>
                        </Flex>
                    </Card>

                    <Card>
                        <Flex justifyContent="start" className="space-x-4">
                            <Icon icon={AcademicCapIcon} variant="light" size="xl" color={'slate'} />
                            <div className="truncate">
                                <Text>Programas Activos</Text>
                                <Metric className="truncate">{programKPI}</Metric>
                            </div>
                        </Flex>
                    </Card>

                    <Card>
                        <Flex justifyContent="start" className="space-x-4">
                            <Icon icon={MapIcon} variant="light" size="xl" color={'slate'} />
                            <div className="truncate">
                                <Text>Campamentos Planificados</Text>
                                <Metric className="truncate">{campKPI}</Metric>
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
                                data={chartStudentsPerProgram}
                                index="description"
                                categories={["num_students"]}
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
                                    <TableHeaderCell>Nombre</TableHeaderCell>
                                    <TableHeaderCell>Fecha Nacimiento</TableHeaderCell>
                                    <TableHeaderCell>Direccion</TableHeaderCell>
                                    <TableHeaderCell>Telefono</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {listInscriptions.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>#{item.id}</TableCell>
                                        <TableCell>
                                            <Text>{item.name} {item.lastname1} {item.lastname2}</Text>
                                        </TableCell>
                                        <TableCell>
                                            <Text>{item.dateBirth}</Text>
                                        </TableCell>
                                        <TableCell>
                                            <Text>{item.address}</Text>
                                        </TableCell>
                                        <TableCell>
                                            <Text>{item.housePhone}</Text>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                        <div className="inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-white pt-12 pb-8 absolute rounded-b-lg">
                            <Link href={"/App/Students"}>
                                <Button
                                    icon={EyeIcon}
                                    className="bg-white shadow-md border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
                                    iconPosition='right'
                                >
                                    Ver más
                                </Button>
                            </Link>
                        </div>
                    </Card>
                </div>
            </Box>
        </>
    )
}

export default Dashboard;