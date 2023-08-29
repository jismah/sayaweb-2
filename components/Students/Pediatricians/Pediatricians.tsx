import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Flex, FormControl, FormLabel, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Spinner, Stack, useDisclosure, useToast } from "@chakra-ui/react";

import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";

import { Card, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Table, Badge, Text, MultiSelect, MultiSelectItem } from '@tremor/react';

export interface Pediatrician{
    id: string;
    name: string;
    medicalInstitution: string;
    officeNumber: string;
    phone: string;
}


export default function Pediatrician(){

    const initialPediatrician : Pediatrician = {
        id: "",
        name: "",
        medicalInstitution: "",
        officeNumber: "",
        phone: "",
    };
    const [dataPediatrician, setDataPediatrician] = useState<Pediatrician>(initialPediatrician);
    const [dataPediatricians, setDataPediatricians] = useState<Pediatrician[]>([]);


    const [editMode, setEditMode] = useState(false);
    const [showMode, setShowMode] = useState(false); // Estado para controlar el modo "mostrar"
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [selectedNames, setSelectedNames] = useState<string[]>([]);
    const isPediatricianSelected = (pediatrician: Pediatrician) =>
    selectedNames.includes(pediatrician.name) || selectedNames.length === 0;
    
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
            const res = await fetch(`https://sayaserver.onrender.com/api/pediatricians?page=${currentPage}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "123456",
            },
            });
            const json = await res.json();
            console.log(json);

            setDataPediatricians(json.response); // ACTUALIZAR EL ESTADO
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
        setDataPediatrician(initialPediatrician);
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
            const res = await fetch('https://sayaserver.onrender.com/api/pediatricians/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
                body: JSON.stringify({
                    name: dataPediatrician.name,
                    medicalInstitution: dataPediatrician.medicalInstitution,
                    officeNumber: dataPediatrician.officeNumber.toString(),
                    phone: dataPediatrician.phone,
                })
            });
            const json = await res.json();
            console.log(json);

            setDataPediatrician(initialPediatrician);

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
    const handleEditData = async (tutor: Pediatrician) => {
        const selectedTutor = dataPediatricians.find(t => t.id === tutor.id)!;
        
        setDataPediatrician(selectedTutor);
        onOpen();

        
        setEditMode(true);
    };

    const handleUpdateData = async () =>{
        const res = await fetch(`https://sayaserver.onrender.com/api/pediatricians/${dataPediatrician.id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "123456",
        },
        body: JSON.stringify({
            id: dataPediatrician.id,
            name: dataPediatrician.name,
            medicalInstitution: dataPediatrician.medicalInstitution,
            officeNumber: dataPediatrician.officeNumber.toString(),
            phone: dataPediatrician.phone,
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
        const res = await fetch(`https://sayaserver.onrender.com/api/tutors/${id}`, {
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
    const handleShowData = async (tutor: Pediatrician) => {
        const selectedTutor = dataPediatricians.find(t => t.id === tutor.id)!;

        setDataPediatrician(selectedTutor);
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




    return (
        <>
            <Box px={3} py={3}>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Box>
                        <ButtonGroup>
                            <Button onClick={handleOpenCreateModal} size='sm' leftIcon={<AddIcon />} variant={'outline'} color={'teal'}>
                                Nuevo pediatra
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
                                        <Input placeholder='Nombre' value={dataPediatrician?.name || ""} type='text'  onChange={(e) => setDataPediatrician({ ...dataPediatrician, name: e.target.value })} />
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Institución médica</FormLabel>
                                        <Input type="text" list="list-medical-institution" placeholder="Escriba la institución médica"
                                        value={dataPediatrician?.medicalInstitution || ""}
                                        onChange={(e) => setDataPediatrician({ ...dataPediatrician, medicalInstitution: e.target.value })} />
                                        <datalist id="list-medical-institution">
                                            <option value="HOMS"></option>
                                            <option value="Unión Médica"></option>
                                            <option value="Instituto Materno Infantil"></option>
                                            <option value="Centro Médico Cibao"></option>
                                            <option value="Clínica Coromina"></option>
                                        </datalist>
                                    </FormControl>

                                    <FormControl>
                                        <FormLabel>Número de oficina</FormLabel>
                                        <NumberInput min={1}
                                        value={dataPediatrician?.officeNumber ? parseInt(dataPediatrician.officeNumber) : ""}
                                        onChange={(valueAsString, valueAsNumber) =>
                                            setDataPediatrician({
                                                ...dataPediatrician,
                                                officeNumber: valueAsString,
                                            })
                                        }>
                                            <NumberInputField/>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Número de telefono</FormLabel>
                                        <Input placeholder='(000)-000-0000'
                                        value={dataPediatrician?.phone || ""}
                                        onChange={(e) => setDataPediatrician({ ...dataPediatrician, phone: e.target.value })}

                                        />
                                    </FormControl>



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
                                <Heading size='md' id='tutores'>Pediatras</Heading>
                                <Badge color="gray">{dataPediatricians.length}</Badge>
                            </Flex>
                            <Box>
                                <MultiSelect
                                    onValueChange={setSelectedNames}
                                    placeholder="Buscar..."
                                    className="max-w-lg"
                                >
                                    {dataPediatricians.map((pediatrician) => (
                                    <MultiSelectItem key={pediatrician.id} value={pediatrician.name}>
                                        {pediatrician.name}
                                    </MultiSelectItem>
                                    ))}
                                </MultiSelect>
                            </Box>
                        </Flex>
                        <Text className="mt-2">Lista de Pediatras Registrados</Text>

                        <Table className='mt-6'>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>Nombre Completo</TableHeaderCell>
                                    <TableHeaderCell>Institución médica</TableHeaderCell>
                                    <TableHeaderCell>Número de oficina</TableHeaderCell>
                                    <TableHeaderCell>Número de teléfono</TableHeaderCell>
                                    <TableHeaderCell>Acciones</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {dataPediatricians
                                .filter((pediatrician) => isPediatricianSelected(pediatrician))
                                .map(pediatrician => {
                                    return (
                                        <TableRow key={pediatrician.id}>
                                            <TableCell>{pediatrician.name}</TableCell>
                                            <TableCell>{pediatrician.medicalInstitution}</TableCell>
                                            <TableCell>{pediatrician.officeNumber}</TableCell>
                                            <TableCell>{pediatrician.phone}</TableCell>
                                            <TableCell>
                                                <ButtonGroup variant='ghost' spacing='1'>
                                                    <IconButton onClick={() => handleShowData(pediatrician)}
                                                    colorScheme='blue' icon={<ViewIcon />} aria-label='Show'></IconButton>

                                                    <IconButton onClick={() => handleEditData(pediatrician)} colorScheme='green' icon={<EditIcon />} aria-label='Edit'></IconButton>

                                                    <IconButton onClick={() => handleDeleteData(pediatrician.id)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete'></IconButton>
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