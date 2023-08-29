import Objectives, { Objective } from "../Objectives/Objectives";
import { Family } from "../../FamilyManagement/Family/Family";
import { User } from "../../FamilyManagement/User/Users";

import Students, { Student } from "../../Students/Students/Students";
import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, CardBody, Flex, FormControl, FormLabel, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, SimpleGrid, Spinner, Stack, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";

import { Card, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Table, Badge, Text, MultiSelect, MultiSelectItem } from '@tremor/react';

import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";

  
export interface Program{
    id: string;
    description: string;
    maxStudents: number;
    inscription: number;
    monthlyAmount: number;
    status: boolean;
}

export default function Programs(){

    const initialProgram : Program = {
        id: "",
        description: "",
        maxStudents: 0,
        inscription: 0,
        monthlyAmount: 0,
        status: true,
    };
    const [dataProgram, setDataProgram] = useState<Program>(initialProgram);
    const [dataPrograms, setDataPrograms] = useState<Program[]>([]);

    //Relaciones con otras tablas: 
    const [dataStudents, setDataStudents] = useState<Student[]>([]);
    const [dataObjectives, setDataObjectives] = useState<Objective[]>([]); 

    const [dataFamily, setDataFamily] = useState<Family>({
        id: "",
        name: "",
        students: [],
        parents: [],
        user: {} as User,
    });


    const [editMode, setEditMode] = useState(false);
    const [showMode, setShowMode] = useState(false); // Estado para controlar el modo "mostrar"
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [selectedNames, setSelectedNames] = useState<string[]>([]);
    const isProgramSelected = (program: Program) =>
    selectedNames.includes(program.description) || selectedNames.length === 0;

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
            const res = await fetch(`https://sayaserver.onrender.com/api/programs?page=${currentPage}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "123456",
            },
            });
            const json = await res.json();
            console.log(json);
        
            setDataPrograms(json.response); // ACTUALIZAR EL ESTADO
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
        setDataProgram(initialProgram);
        setEditMode(false);
        setShowMode(false);


        onOpen();
    };

    const handleCreateData = async (e: React.FormEvent) => {
        e.preventDefault()
        if(editMode){
            handleUpdateData();
            onClose();
        }else{
            console.log('datos crear programa');
            console.log(dataProgram);
            const res = await fetch('https://sayaserver.onrender.com/api/programs/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
                body: JSON.stringify({
                    description:  dataProgram.description.toString(),
                    maxStudents: dataProgram.maxStudents.toString(),
                    inscription: dataProgram.inscription.toString(),
                    monthlyAmount: dataProgram.monthlyAmount.toString(),
                    status: dataProgram.status.toString(),
                })
            });
            const json = await res.json();
            console.log(json);

            setDataProgram(initialProgram);

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
    const handleEditData = async (program: Program) => {
        const selectedProgram = dataPrograms.find(p => p.id === program.id)!;
        
        setDataProgram(selectedProgram);
        onOpen();


        setEditMode(true);
    };

    const handleUpdateData = async () =>{
        const res = await fetch(`https://sayaserver.onrender.com/api/programs/${dataProgram.id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "123456",
        },
        body: JSON.stringify({
            id: dataProgram.id.toString(),
            description:  dataProgram.description.toString(),
            maxStudents: dataProgram.maxStudents.toString(),
            inscription: dataProgram.inscription.toString(),
            monthlyAmount: dataProgram.monthlyAmount.toString(),
            status: dataProgram.status.toString(),
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
        const res = await fetch(`https://sayaserver.onrender.com/api/programs/${id}`, {
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
    const handleShowData = async (program: Program) => {
        const selectedProgram = dataPrograms.find(p => p.id === program.id)!;

        setDataProgram(selectedProgram);
        setShowMode(true); // Cambiar a modo "mostrar"
        onOpen();

    };



    const handlePageChange = (newPage: number) => {
        console.log("Changing page to:", newPage);
        setCurrentPage(prevPage => newPage);
    };
    

    useEffect(() => {
        fetchData();

        if (dataProgram.id) {
            fetchRelations(); 
        }
    }, [currentPage, dataProgram]);

    const fetchRelations = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://sayaserver.onrender.com/api/programs/info/${dataProgram.id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
            });
            const json = await response.json();
            console.log(json);

            if(json.response){
                const {students, objectives} = json.response;

                setDataStudents(students); 
                setDataObjectives(objectives);
            }

        } catch (error) {
            console.error(error);
            // MANEJO DE ERRORES
        }finally{
            setLoading(false);
        }
    };

    console.log("dataProgram.id:", dataProgram.id);
    //console.log("dataObjectives:", dataObjectives);

    return (
        <>
            <Box px={3} py={3}>
                <Flex justifyContent={'space-between'} alignItems={'center'} mt={'40px'}>
                    <Box>
                        <ButtonGroup>
                            <Button onClick={handleOpenCreateModal} size='sm' leftIcon={<AddIcon />} variant={'outline'} color={'teal'}>
                                Nuevo programa
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
                                        <FormLabel>Descripción</FormLabel>
                                        <Input placeholder="Descripción" value={dataProgram.description || ""} type='text' readOnly={showMode}  onChange={(e) => setDataProgram({ ...dataProgram, description: e.target.value })} />
                                    </FormControl>

                                    <SimpleGrid columns={2} spacing={10}>
                                        <FormControl>
                                            <FormLabel>Máximo de estudiantes</FormLabel>
                                            <NumberInput min={1} max={64} isReadOnly={showMode}
                                            value={dataProgram.maxStudents || 0}
                                            onChange={(valueString) =>
                                                setDataProgram({ ...dataProgram, maxStudents: parseInt(valueString) })
                                            }>
                                                <NumberInputField/>
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </FormControl>

                                        <FormControl>
                                        <FormLabel>Inscripción</FormLabel>
                                        <NumberInput min={1} isReadOnly={showMode}
                                        value={dataProgram.inscription || 0}
                                        onChange={(valueString) =>
                                            setDataProgram({ ...dataProgram, inscription: parseInt(valueString) })
                                        }>
                                            <NumberInputField/>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                        </FormControl>
                                    </SimpleGrid>

                                    <SimpleGrid columns={2} spacing={10}>
                                        <FormControl>
                                        <FormLabel>Monto mensual</FormLabel>
                                        <NumberInput min={1}
                                        value={dataProgram.monthlyAmount || 0} isReadOnly={showMode}
                                        onChange={(valueString) =>
                                            setDataProgram({ ...dataProgram, monthlyAmount: parseInt(valueString) })
                                        }>
                                            <NumberInputField/>
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                        </FormControl>

                                    </SimpleGrid>

                                    
                                    {editMode && loading ? (
                                        <Box pt={4}>
                                            <Card>    
                                                <Box height={'10vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                                    <Spinner color='teal' size='xl' thickness='3px' />
                                                </Box>
                                            </Card>
                                        </Box>
                                    ) : (
                                        <Box>
                                            {/* Listado de estudiantes */}
                                            {(editMode || showMode) && <Students familyStudents={dataStudents} dataFamily={dataFamily} enableEditing={true} familyMode={false} programMode={true}/> }


                                            {/* Listado de objetivos */}
                                            {dataProgram.id && <Objectives dataObjectives={dataObjectives}  programMode={true} />}
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
                    <Card >
                        <Flex justifyContent={'space-between'} alignItems={'center'}>
                            <Flex justifyContent="start" className="space-x-2">
                                <Heading size='md' id='tutores'>Programas</Heading>
                                <Badge color="gray">{dataPrograms.length}</Badge>
                                </Flex>
                                <Box>
                                <MultiSelect
                                    onValueChange={setSelectedNames}
                                    placeholder="Buscar..."
                                    className="max-w-lg"
                                >
                                    {dataPrograms.map((program) => (
                                    <MultiSelectItem key={program.id} value={program.description}>
                                        {program.description}
                                    </MultiSelectItem>
                                    ))}
                                </MultiSelect>
                                </Box>
                            </Flex>
                        <Text className="mt-2">Lista de Programas Registrados</Text>
                       
                        <Table className='mt-6'>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell>Descripción</TableHeaderCell>
                                    <TableHeaderCell>Máximo de estudiantes</TableHeaderCell>
                                    <TableHeaderCell>Costo inscripción</TableHeaderCell>
                                    <TableHeaderCell>Monto mensual</TableHeaderCell>
                                    <TableHeaderCell>Acciones</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataPrograms
                                .filter((program) => isProgramSelected(program))
                                .map(program => {
                                    return (
                                        <TableRow key={program.id}>
                                            <TableCell>{program.id}</TableCell>
                                            <TableCell>{program.description}</TableCell>
                                            <TableCell>{program.maxStudents}</TableCell>
                                            <TableCell>{program.inscription}</TableCell>
                                            <TableCell>{program.monthlyAmount}</TableCell>
                                            <TableCell>
                                                <ButtonGroup variant='ghost' spacing='1'>
                                                    <IconButton onClick={() => handleShowData(program)}
                                                    colorScheme='blue' icon={<ViewIcon />} aria-label='Show'></IconButton>

                                                    <IconButton onClick={() => handleEditData(program)} colorScheme='green' icon={<EditIcon />} aria-label='Edit'></IconButton>

                                                    <IconButton onClick={() => handleDeleteData(program.id)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete'></IconButton>
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