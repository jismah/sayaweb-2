import { Box, Heading } from "@chakra-ui/react";
import { Card, Title, Table, Grid, Col, DeltaType, BadgeDelta, MultiSelect, MultiSelectItem, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Button } from "@tremor/react";
import { NextPage } from "next";
import { useState } from "react";

type Staff = {
    id: number;
    name: string;
    lastName1: string;
    lastName2: string;
    phone: string;
    salary: number;
    position: string;
    email: string;
    identityNumber: string;
    status: boolean;
};

const listStaffs: Staff[] = [
    {
        id: 1,
        name: "John",
        lastName1: "Smith",
        lastName2: "Rodriguez",
        phone: "8490990000",
        salary: 80000,
        position: "Director Web Asociado",
        email: "johnsmith@gmail.com",
        identityNumber: "40200000000",
        status: true,
    },
    {
        id: 2,
        name: "Jean",
        lastName1: "Smith",
        lastName2: "Rodriguez",
        phone: "8490990000",
        salary: 80000,
        position: "Director Web Asociado",
        email: "johnsmith@gmail.com",
        identityNumber: "40200000000",
        status: true,
    },
    {
        id: 3,
        name: "Misael",
        lastName1: "Smith",
        lastName2: "Rodriguez",
        phone: "8490990000",
        salary: 80000,
        position: "Director Web Asociado",
        email: "johnsmith@gmail.com",
        identityNumber: "40200000000",
        status: true,
    },
];

const RRHH: NextPage = () => {

    const [selectedNames, setSelectedNames] = useState<string[]>([]);

    const isSalesPersonSelected = (staff: Staff) =>
        selectedNames.includes(staff.name) || selectedNames.length === 0;

    return (
        <>
            <Box p={4} width={'100%'}>
                <Title>Gestión de Empleados</Title>
                <Card className="h-full mt-6">
                    <MultiSelect
                        onValueChange={setSelectedNames}
                        placeholder="Buscar..."
                        className="max-w-xs"
                    >
                        {listStaffs.map((item) => (
                            <MultiSelectItem key={item.name} value={item.name}>
                                {item.name}
                            </MultiSelectItem>
                        ))}
                    </MultiSelect>
                    <Table className="mt-6">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>Name</TableHeaderCell>
                                <TableHeaderCell>Leads</TableHeaderCell>
                                <TableHeaderCell>Sales ($)</TableHeaderCell>
                                <TableHeaderCell>Quota ($)</TableHeaderCell>
                                <TableHeaderCell>Variance</TableHeaderCell>
                                <TableHeaderCell>Region</TableHeaderCell>
                                <TableHeaderCell></TableHeaderCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {listStaffs
                                .filter((item) => isSalesPersonSelected(item))
                                .map((item) => (
                                    <TableRow key={item.name}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.position}</TableCell>
                                        <TableCell>{item.salary}</TableCell>
                                        <TableCell>{item.phone}</TableCell>
                                        <TableCell>{item.identityNumber}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="xs" variant="secondary" color="teal">
                                                Ver Detalles
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </Card>

            </Box>
        </>
    )
};

export default RRHH;