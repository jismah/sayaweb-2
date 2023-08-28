import { Box, Heading } from "@chakra-ui/react";
import { useUser } from "@supabase/auth-helpers-react";
import { Card, Title, Table, Grid, Col, DeltaType, BadgeDelta, MultiSelect, MultiSelectItem, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Button } from "@tremor/react";
import { NextPage } from "next";
import router from "next/router";
import { useEffect, useState } from "react";

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

const RRHH: NextPage = () => {
    const user = useUser();

    const [selectedNames, setSelectedNames] = useState<string[]>([]);
    const [listStaff, setListStaff] = useState<Staff[]>([]);

    const isSalesPersonSelected = (staff: Staff) =>
        selectedNames.includes(staff.name) || selectedNames.length === 0;

    /* FETCH PARA LISTAR EMPLEADOS*/
    const fetchListStaff = async () => {
        await fetch('https://sayaserver.onrender.com/api/staff', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "123456",
            },
        })
            .then(response => response.json())
            .then(data => {
                setListStaff(data.response);
            });
    }

    useEffect(() => {
        if (user) {
            fetchListStaff();
        } else {
            router.push('/Auth/Login');
        }

    });

    return (
        <>
            <Box p={4} width={'100%'}>
                <Heading size={"md"}>Gestión de Empleados</Heading>
                <Card className="h-full mt-6">
                    <MultiSelect
                        onValueChange={setSelectedNames}
                        placeholder="Buscar..."
                        className="max-w-xs"
                    >
                        {listStaff.map((item) => (
                            <MultiSelectItem key={item.name} value={item.name}>
                                {item.name}
                            </MultiSelectItem>
                        ))}
                    </MultiSelect>
                    <Table className="mt-6">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>ID</TableHeaderCell>
                                <TableHeaderCell>Cédula</TableHeaderCell>
                                <TableHeaderCell>Nombre</TableHeaderCell>
                                <TableHeaderCell>Correo</TableHeaderCell>
                                <TableHeaderCell>Posición</TableHeaderCell>
                                <TableHeaderCell>Salario</TableHeaderCell>
                                <TableHeaderCell>Contacto</TableHeaderCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {listStaff
                                .filter((item) => isSalesPersonSelected(item))
                                .map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>#{item.id}</TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.identityNumber}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.position}</TableCell>
                                        <TableCell>RD$ {item.salary}</TableCell>
                                        <TableCell>{item.phone}</TableCell>

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