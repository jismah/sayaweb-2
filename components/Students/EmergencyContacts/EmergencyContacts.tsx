import { Student } from "../../Students/Students/Students";
import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Flex, FormControl, FormLabel, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Spinner, Stack, useDisclosure, useToast } from "@chakra-ui/react";

//Select
import { Select } from "@chakra-ui/react";
//MultiSelect
import { MultiSelect, MultiSelectItem } from "@tremor/react";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";

import { Card, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Table, Badge, Text  } from '@tremor/react';


export interface EmergencyContact{
    id: string;
    name: string;
    phone: string;

    idStudent: string;
}
  
  
export default function EmergencyContacts(){

    const initialEmergencyContact : EmergencyContact = {
        id: "",
        name: "",
        phone: "",
        idStudent: "",
    };
    const [dataEmergencyContact, setDataEmergencyContact] = useState<EmergencyContact>(initialEmergencyContact);
    const [dataEmergencyContacts, setDataEmergencyContacts] = useState<EmergencyContact[]>([]);

    const [dataStudents, setDataStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string | undefined>(dataEmergencyContact.idStudent);


    const [editMode, setEditMode] = useState(false);
    const [showMode, setShowMode] = useState(false); // Estado para controlar el modo "mostrar"
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [selectedNames, setSelectedNames] = useState<string[]>([]);
    const isEmergencyContactSelected = (emergencyContact: EmergencyContact) =>
    selectedNames.includes(emergencyContact.name) || selectedNames.length === 0;

    // PAGINATION
    const pageSize = 10; // Cantidad de elementos por página
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0); // Nuevo estado para el total de registros


    
    // Lógica para crear el grupo (enviar los datos al servidor, etc.)

    // GET DATA TO LOAD ARRAY
    const fetchData = async () => {
        setLoading(true);
        try{
            const res = await fetch(`https://sayaserver.onrender.com/api/emergencyContacts?page=${currentPage}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "123456",
            },
            });
            const json = await res.json();
            console.log(json);
        
            setDataEmergencyContacts(json.response); // ACTUALIZAR EL ESTADO
            setTotalRecords(json.total); // Establecer el total de registros
            setTotalPages(Math.ceil(json.total / pageSize)); // Calcular y establecer el total de páginas
            
        } catch (error) {
            console.error(error);
            // MANEJO DE ERRORES
            } finally {
            setLoading(false); 
            }
    };


    // CREATE DATA
    const handleOpenCreateModal = () => {
        setDataEmergencyContact(initialEmergencyContact);
        setEditMode(false);
        setShowMode(false);


        onOpen();
    };

    const handleCreateData = async (e: React.FormEvent) => {
        e.preventDefault()
        if(editMode){
            handleUpdateData()
            onClose()
        }else{
            const res = await fetch('https://sayaserver.onrender.com/api/emergencyContacts/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
                body: JSON.stringify({
                    name: dataEmergencyContact.name,
                    phone: dataEmergencyContact.phone,
                    idStudent: selectedStudentId,
                })
            });
            const json = await res.json();
            console.log(json);

            setDataEmergencyContact(initialEmergencyContact);
            setSelectedStudentId("");

            toast({
                title: 'Registro Creado!',
                description: "Se creo el registro correctamente.",
                status: 'success',
                position: 'bottom-right',
                duration: 4000,
                isClosable: true,
                });
        }

        setShowMode(false);
        setEditMode(false);

        fetchData();
    };

    // EDIT DATA
    const handleEditData = async (emergencyContact: EmergencyContact) => {
        const selectedEmergencyContact = dataEmergencyContacts.find(ec => ec.id === emergencyContact.id)!;
        
        setDataEmergencyContact(selectedEmergencyContact);
        onOpen();

        
        setEditMode(true);
    };

    const handleUpdateData = async () =>{
        const res = await fetch(`https://sayaserver.onrender.com/api/emergencyContacts/${dataEmergencyContact.id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "123456",
        },
        body: JSON.stringify({
            id: dataEmergencyContact.id,
            name: dataEmergencyContact.name,
            phone: dataEmergencyContact.phone,
            idStudent: selectedStudentId,
        })
        });
        const json = await res.json();
        console.log(json);
        onClose();
        setEditMode(false);
        fetchData();
    }

    // DELETE DATA
    const handleDeleteData = async (id: string) => {
        const res = await fetch(`https://sayaserver.onrender.com/api/emergencyContacts/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "123456",
        },
        body: JSON.stringify({ id }),
        })
        const json = await res.json()
        toast({
        title: 'Registro Eliminado!',
        description: "Se elimino el registro correctamente.",
        status: 'success',
        position: 'bottom-right',
        duration: 4000,
        isClosable: true,
        })
        fetchData();
    }


    // SHOW DATA
    const handleShowData = async (emergencyContact: EmergencyContact) => {
        const selectedEmergencyContact = dataEmergencyContacts.find(ec => ec.id === emergencyContact.id)!;

        setDataEmergencyContact(selectedEmergencyContact);
        setShowMode(true); // Cambiar a modo "mostrar"
        onOpen();

    };



    const handlePageChange = (newPage: number) => {
        console.log("Changing page to:", newPage);
        setCurrentPage(prevPage => newPage);
    };
    

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    useEffect(() => {

        fetchRelations();
        
    }, []);

    useEffect(() => {

        setSelectedStudentId(dataEmergencyContact.idStudent)
        
    }, [dataEmergencyContact.idStudent]);

    const fetchRelations = async () => {
        setLoading(true);
        try {
            const responseStudents = await fetch(`https://sayaserver.onrender.com/api/students/${dataEmergencyContact.idStudent}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
            });
            const jsonStudents = await responseStudents.json();
            console.log(jsonStudents);

            
            setDataStudents(jsonStudents.response); 
            

        } catch (error) {
            console.error(error);
            // MANEJO DE ERRORES
        }finally{
            setLoading(false);
        }
    };


    return (
        <>
            <Box px={3} py={3}>
                <Flex justifyContent={'space-between'} alignItems={'center'} mt={'40px'}>
                    <Box>
                        <ButtonGroup>
                            <Button onClick={handleOpenCreateModal} size='sm' leftIcon={<AddIcon />} variant={'outline'} color={'teal'}>
                                Nuevo contacto de emergencia
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Flex> 


                <Modal onClose={() => { setShowMode(false); onClose();}} size={'full'} isOpen={isOpen}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{editMode ? "Editar" : (showMode ? "Detalle" : "Crear") }</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Box px={3} py={3}>
                            <form onSubmit={handleCreateData}>
                                <Stack spacing={4}>    

                                        <FormControl isRequired>
                                            <FormLabel>Nombre completo</FormLabel>
                                            <Input placeholder='Nombre' value={dataEmergencyContact.name || ""} onChange={(e) => setDataEmergencyContact({ ...dataEmergencyContact, name: e.target.value })} />
                                        </FormControl>

                                        <FormControl isRequired>
                                            <FormLabel>Número de teléfono</FormLabel>
                                            <Input type="tel" placeholder='(000)-000-0000' value={dataEmergencyContact.phone || ""} onChange={(e) => setDataEmergencyContact({ ...dataEmergencyContact, phone: e.target.value })} />
                                        </FormControl>

                                        {loading ? (
                                            <Box pt={4}>
                                            <Card>
                                                <Box height={'10vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                                    <Spinner color='teal' size='xl' thickness='3px' />
                                                </Box>
                                            </Card>
                                        </Box>
                                        ): (
                                            <Box>
                                                <SimpleGrid columns={2} spacing={10}>
                                                    <FormControl isRequired>
                                                        <FormLabel>Estudiante</FormLabel>
                                                        <Select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)} placeholder='Seleccionar estudiante'>
                                                            {dataStudents.map(student => (
                                                                <option key={student.id} value={student.id}>
                                                                    {student.name} {student.lastName1} {student.lastName2}
                                                                </option>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </SimpleGrid>
                                            </Box>
                                        )}



                                    {!showMode && (
                                        <Button type="submit" colorScheme="teal" mr={3}>Agregar </Button>
                                    )}
                                    <Button variant={'ghost'} onClick={onClose}>Cancelar</Button>

                                </Stack>
                            </form>
                            </Box>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>        

                {loading ?
                <Box pt={4}>
                    <Card>
                        <Box height={'80vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            <Spinner color='teal' size='xl' thickness='3px' />
                        </Box>
                    </Card>
                </Box>
                : <Box pt={4}>
                    <Card>
                        <Flex justifyContent={'space-between'} alignItems={'center'}>
                            <Flex justifyContent="start" className="space-x-2">
                                <Heading size='md' id='tutores'>Contactos de Emergencia</Heading>
                                <Badge color="gray">{dataEmergencyContacts.length}</Badge>
                            </Flex>
                            <Box>
                                <MultiSelect
                                    onValueChange={setSelectedNames}
                                    placeholder="Buscar..."
                                    className="max-w-lg"
                                >
                                    {dataEmergencyContacts.map((emergencyContact) => (
                                    <MultiSelectItem key={emergencyContact.id} value={emergencyContact.name}>
                                        {emergencyContact.name}
                                    </MultiSelectItem>
                                    ))}
                                </MultiSelect>
                            </Box>
                        </Flex>
                        <Text className="mt-2">Lista de Contactos de Emergencia Registrados</Text>
                        
                        <Table className='mt-6'>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>Nombre Completo</TableHeaderCell>
                                    <TableHeaderCell>Teléfono</TableHeaderCell>
                                    <TableHeaderCell>Niño asignado</TableHeaderCell>
                                    <TableHeaderCell>Acciones</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {dataEmergencyContacts
                            .filter((emergencyContact) => isEmergencyContactSelected(emergencyContact))
                            .map(emergencyContact => {
                                    return (
                                        <TableRow key={emergencyContact.id}>
                                            <TableCell>{emergencyContact.name}</TableCell>
                                            <TableCell>{emergencyContact.phone}</TableCell>
                                            <TableCell>
                                                {dataStudents.find(student => student.id === emergencyContact.idStudent)?.name} {" "}
                                                {dataStudents.find(student => student.id === emergencyContact.idStudent)?.lastName1} {" "}
                                                {dataStudents.find(student => student.id === emergencyContact.idStudent)?.lastName2} {" "}
                                            </TableCell>
                                            <TableCell>
                                                <ButtonGroup variant='ghost' spacing='1'>
                                                    <IconButton onClick={() => handleShowData(emergencyContact)}
                                                    colorScheme='blue' icon={<ViewIcon />} aria-label='Show'></IconButton>

                                                    <IconButton onClick={() => handleEditData(emergencyContact)} colorScheme='green' icon={<EditIcon />} aria-label='Edit'></IconButton>

                                                    <IconButton onClick={() => handleDeleteData(emergencyContact.id)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete'></IconButton>
                                                </ButtonGroup>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                                }
                            </TableBody>

                        </Table>
                    </Card>
                </Box>
                        
                }         


                <ButtonGroup mt={3} justifyContent='center'>
                    <Button
                        onClick={() => handlePageChange(1)}
                        colorScheme={currentPage === 1 ? 'teal' : 'gray'}
                    >
                        {'<<'}
                    </Button>
                    <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        colorScheme={currentPage === 1 ? 'gray' : 'teal'}
                        isDisabled={currentPage === 1}
                    >
                        {'<'}
                    </Button>

                    {/* Botones de números de paginación */}
                    {totalPages <= 10
                    ? Array.from({ length: totalPages }, (_, index) => (
                        <Button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            colorScheme={currentPage === index + 1 ? 'teal' : 'gray'}
                        >
                            {index + 1}
                        </Button>
                        ))
                    : currentPage <= 5
                    ? Array.from({ length: 10 }, (_, index) => (
                        <Button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            colorScheme={currentPage === index + 1 ? 'teal' : 'gray'}
                        >
                            {index + 1}
                        </Button>
                        ))
                    : currentPage >= totalPages - 4
                    ? Array.from({ length: 10 }, (_, index) => (
                        <Button
                            key={totalPages - 9 + index}
                            onClick={() => handlePageChange(totalPages - 9 + index)}
                            colorScheme={currentPage === totalPages - 9 + index ? 'teal' : 'gray'}
                        >
                            {totalPages - 9 + index}
                        </Button>
                        ))
                    : Array.from({ length: 10 }, (_, index) => (
                        <Button
                            key={currentPage - 5 + index}
                            onClick={() => handlePageChange(currentPage - 5 + index)}
                            colorScheme={currentPage === currentPage - 5 + index ? 'teal' : 'gray'}
                        >
                            {currentPage - 5 + index}
                        </Button>
                        ))}


                    <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        colorScheme={currentPage === totalPages ? 'gray' : 'teal'}
                        isDisabled={currentPage === totalPages}
                    >
                        {'>'}
                    </Button>
                    

                    <Button
                        onClick={() => handlePageChange(totalPages)}
                        colorScheme={currentPage === totalPages ? 'teal' : 'gray'}
                    >
                        {'>>'}
                    </Button>
                </ButtonGroup>

            </Box>
        </>
    )
}