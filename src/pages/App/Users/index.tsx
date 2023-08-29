import { Box, Flex, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Text, Avatar } from "@chakra-ui/react";
import { PlusIcon } from "@heroicons/react/20/solid";
import { Card, Table, MultiSelect, MultiSelectItem, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Button } from "@tremor/react";
import { NextPage } from "next";
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

    const { isOpen, onOpen, onClose } = useDisclosure();

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
                    <Button size="xs" color="teal" icon={PlusIcon} disabled={true}>Crear Usuario</Button>

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
                                            <Button size="xs" variant="secondary" color="teal" onClick={onOpen}>
                                                Ver Detalles
                                            </Button>
                                            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                                                <ModalOverlay />
                                                <ModalContent>
                                                    <ModalHeader>Usuario Detalles</ModalHeader>
                                                    <ModalCloseButton />
                                                    <ModalBody>
                                                        <Flex alignItems={"center"} mb={5}>
                                                            <Avatar name={item.username} src={item.avatar_url} />
                                                            <Text fontWeight='bold' ml={2}>{item.username}</Text>
                                                        </Flex>
                                                        <Box mb={3}>
                                                            <Heading size={"sm"}>
                                                                ID
                                                            </Heading>
                                                            <Text>
                                                                {item.id}
                                                            </Text>
                                                        </Box>
                                                        <Box>
                                                            <Heading size={"sm"}>
                                                                Nombre Completo
                                                            </Heading>
                                                            <Text>
                                                                {item.full_name}
                                                            </Text>
                                                        </Box>
                                                    </ModalBody>

                                                    <ModalFooter>
                                                        <Button color='teal' onClick={onClose}>
                                                            Cerrar
                                                        </Button>
                                                    </ModalFooter>
                                                </ModalContent>
                                            </Modal>
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