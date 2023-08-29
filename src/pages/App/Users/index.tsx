import { Box, Flex, Heading } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useUser } from "@supabase/auth-helpers-react";
import { Card, Title, Table, Grid, Col, DeltaType, BadgeDelta, MultiSelect, MultiSelectItem, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Button } from "@tremor/react";
import { NextPage } from "next";
import router from "next/router";
import { useEffect, useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'


interface ProfileUser {
    id: string;
    full_name: string;
    avatar_url: string;
    username: string;
}

const UsersPage: NextPage = () => {

    const supabase = createClientComponentClient();
    const [listUsers, setListUsers] = useState<ProfileUser[]>([]);
    const [selectedNames, setSelectedNames] = useState<string[]>([]);

    const isUserSelected = (user: ProfileUser) =>
        selectedNames.includes(user.username) || selectedNames.length === 0;


    const searchUsers = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select();

        
        if (data) {
            setListUsers(data);
        }
        if (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        searchUsers();
    });

    return (
        <>
            <Box p={4} width={'100%'}>
                <Flex justifyContent={"space-between"} alignItems={"center"}>
                    <Heading size={"md"}>Usuarios</Heading>
                    <Button size="xs" color="teal" icon={PlusIcon}>Crear Usuario</Button>

                </Flex>

                <Card className="h-full mt-6">
                    <MultiSelect
                        onValueChange={setSelectedNames}
                        placeholder="Buscar..."
                        className="max-w-xs"
                    >
                        {listUsers.map((item) => (
                            <MultiSelectItem key={item.id} value={item.username}>
                                {item.username}
                            </MultiSelectItem>
                        ))}
                    </MultiSelect>
                    <Table className="mt-6">
                        <TableHead>
                            <TableRow>
                                <TableHeaderCell>ID</TableHeaderCell>
                                <TableHeaderCell>Usuario</TableHeaderCell>
                                <TableHeaderCell>Nombre</TableHeaderCell>
                                <TableHeaderCell></TableHeaderCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {listUsers
                                .filter((item) => isUserSelected(item))
                                .map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.id}</TableCell>
                                        <TableCell>{item.username}</TableCell>
                                        <TableCell>{item.full_name}</TableCell>
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
}

export default UsersPage;