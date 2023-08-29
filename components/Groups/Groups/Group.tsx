import { Shift } from "../Shifts/Shifts";
import { Student } from "../../Students/Students/Students";
import { Staff } from "../../StaffAdministrator/Staff/Staff";
import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, CardBody, Checkbox, Flex, FormControl, FormLabel, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, SimpleGrid, Spinner, Stack, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";

//Select
import { Select, SelectItem } from "@tremor/react";
//MultiSelect
import { MultiSelect, MultiSelectItem } from "@tremor/react";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";

import { Card, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Table, Badge, Text } from '@tremor/react';


export interface Group {
    id: string;
    maxStudents: number;
    idShift: string;
}

export interface ProfessorsForGroup {
    idProfessor: string;
    idGroup: string;
}

export interface StudentOnGroup {
    idStudent: string;
    idGroup: string;
}

export interface GroupOnCamp {
    idCamp: string;
    idGroup: string;
}

//Interfaz de profesor provisional para guardar la información completa de /groups/info
interface Professor {
    id: string;
    academicCategory: string;
    idStaff: string;
    staff: Staff;
}
  
  
  
export default function Groups(){

    const initialGroupData : Group = {
        id: "",
        maxStudents: 0,
        idShift: "",
    };

    const initialShiftData : Shift = {
        id: "",
        initialHour: "",
        finishHour: "",
        idStaff: "",
        idAcademicYear: "",
        idWeekDay: "",
    };

    const [dataGroup, setDataGroup] = useState<Group>(initialGroupData);
    const [dataGroups, setDataGroups] = useState<Group[]>([]);

    const [dataShifts, setDataShifts] = useState<Shift[]>([]);
    const [dataStudents, setDataStudents] = useState<Student[]>([]);
    const [dataProfessors, setDataProfessors] = useState<Professor[]>([]);

    //Manejar select y multiselect
    const [valueShift, setValueShift] = useState("");
    const [valueProfessors, setValueProfessors] = useState<string[]>([]);
    const [valueStudents, setValueStudents] = useState<string[]>([]);


    const [editMode, setEditMode] = useState(false);
    const [showMode, setShowMode] = useState(false); // Estado para controlar el modo "mostrar"
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    
    const [selectedNames, setSelectedNames] = useState<string[]>([]);
    const isGroupSelected = (group: Group) =>
    selectedNames.includes(group.id) || selectedNames.length === 0;

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
            const res = await fetch(`https://sayaserver.onrender.com/api/groups?page=${currentPage}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "123456",
            },
            });
            const json = await res.json();
            console.log(json);
        
            setDataGroups(json.response); // ACTUALIZAR EL ESTADO
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
        setDataGroup(initialGroupData);
        setEditMode(false);
        setShowMode(false);

        onOpen();
    };

    const handleCreateData = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editMode) {
            handleUpdateData();
            onClose();
        } else {
            console.log(valueProfessors);
            console.log(valueStudents);
            console.log(valueShift);

            const requestBody = {
                maxStudents: dataGroup.maxStudents.toString(),
                idShift: valueShift.toString(),
                professors: valueProfessors.map(id => ({ id })),
                students: valueStudents.map(id => ({ id })),
                camps: [],
            };
    
            console.log(requestBody);
            const resGroupsBulk = await fetch('https://sayaserver.onrender.com/api/groups/bulk', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
                body: JSON.stringify(requestBody),
            });
            
            const jsonGroupsBulk = await resGroupsBulk.json();
            console.log(jsonGroupsBulk);
    
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
    const handleEditData = async (group: Group) => {
        const selectedGroup = dataGroups.find(g => g.id === group.id)!;
        
        setDataGroup(selectedGroup);
        onOpen();
  
        
        setEditMode(true);
    };

    const handleUpdateData = async () =>{
        const res = await fetch(`https://sayaserver.onrender.com/api/groups/${dataGroup.id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "123456",
        },
        body: JSON.stringify({
            id: dataGroup.id,
            maxStudents: dataGroup.maxStudents,
            idShift: dataGroup.idShift,
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
        const res = await fetch(`https://sayaserver.onrender.com/api/groups/${id}`, {
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
    const handleShowData = async (group: Group) => { 
        const selectedGroup = dataGroups.find(g => g.id === group.id)!;

        setDataGroup(selectedGroup);
        setShowMode(true); // Cambiar a modo "mostrar"
        onOpen();
    };

    //Cargar lista de estudiantes, profesores y tandas
    const loadGroupInformation = async () => {
        setLoading(true); 

        //Petición para obtener los demás cabeceras de la familia
        try{
        const response = await fetch(`https://sayaserver.onrender.com/api/groups/info`, {
            method: 'GET',
            headers: {
            "Content-Type": "application/json",
            "x-api-key": "123456",
        },
        });
        const json = await response.json();
        //setFamilyHeaders(json.response);    

        if(json.response){
            const {students, professors, shifts } = json.response;
                setDataStudents(students);
                setDataProfessors(professors);
                setDataShifts(shifts);
            }

        } catch (error) {
            console.error(error);
        }  finally {
            setLoading(false); 
        }
    }

    const handlePageChange = (newPage: number) => {
        console.log("Changing page to:", newPage);
        setCurrentPage(prevPage => newPage);
    };
    

    useEffect(() => {
        fetchData();

        loadGroupInformation();
    }, [currentPage]);
    


    return (
        <>
            <Box px={3} py={3}>
                <Flex justifyContent={'space-between'} alignItems={'center'} mt={'40px'}>
                    <Box>
                        <ButtonGroup>
                            <Button onClick={handleOpenCreateModal} size='sm' leftIcon={<AddIcon />} variant={'outline'} color={'teal'}>
                                Nuevo Grupo
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

                                    {loading ? (
                                        <Box pt={4}>
                                        <Card>
                                            <Box height={'10vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                                <Spinner color='teal' size='xl' thickness='3px' />
                                            </Box>
                                        </Card>
                                        </Box>
                                    ) : (
                                        <Box pt={4}>
                                            <FormControl>
                                                <FormLabel>Máximo de estudiantes</FormLabel>
                                                <NumberInput min={1} max={64} isReadOnly={showMode}
                                                value={dataGroup.maxStudents || 0}
                                                onChange={(valueString) =>
                                                    setDataGroup({ ...dataGroup, maxStudents: parseInt(valueString) })
                                                }>
                                                    <NumberInputField/>
                                                    <NumberInputStepper>
                                                        <NumberIncrementStepper />
                                                        <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </FormControl>


                                            <SimpleGrid columns={2} spacing={10} mb={3}>
                                                <Box>
                                                    {/* Multiselect profesores */}
                                                    <Heading as='h3' size='md' id='professors' >Profesores</Heading>
                                                    <MultiSelect value={valueProfessors} onValueChange={setValueProfessors}>
                                                    {dataProfessors.map((professor) => (
                                                        <MultiSelectItem key={professor.id} value={professor.id}>
                                                        {professor.staff.name} {professor.staff.lastName1} {professor.staff.lastName2}
                                                        </MultiSelectItem>
                                                    ))}
                                                    </MultiSelect>
                                                </Box>

                                                <Box>
                                                    {/* Multiselect estudiantes */}
                                                    <Heading as='h3' size='md' id='students'>Estudiantes</Heading>
                                                    <MultiSelect value={valueStudents} onValueChange={setValueStudents}  >
                                                    {dataStudents.map((student) => (
                                                        <MultiSelectItem key={student.id} value={student.id}  >
                                                        {student.name} {student.lastName1} {student.lastName2}
                                                        </MultiSelectItem>
                                                    ))}
                                                    </MultiSelect>
                                                </Box>
                                            </SimpleGrid>
                                           
                                            <SimpleGrid columns={2} spacing={10} mb={3}>
                                                <Box>
                                                    {/* Select tandas */}
                                                    <Heading as='h3' size='md' id='shifts' >Tanda</Heading>
                                                    <Select value={valueShift} onValueChange={setValueShift}>
                                                        {dataShifts.map((shift) => (
                                                            <SelectItem key={shift.id} value={shift.id}>
                                                                {shift.initialHour} - {shift.finishHour}
                                                            </SelectItem>
                                                        ))}
                                                    </Select>
                                                </Box>
                                            </SimpleGrid>

                                    
                                        </Box>
                                    )}



                                    <Button type='submit' colorScheme='teal' mr={3}>
                                                {showMode ? "Cerrar" : "Agregar"}
                                            </Button>
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
                    <Card >
                        <Box height={'80vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            <Spinner color='teal' size='xl' thickness='3px' />
                        </Box>
                    </Card>
                </Box>
                : <Box pt={4}>
                    <Card>
                        <Flex justifyContent={'space-between'} alignItems={'center'}>
                            <Flex justifyContent="start" className="space-x-2">
                                <Heading size='md' id='tutores'>Grupos</Heading>
                                <Badge color="gray">{dataGroups.length}</Badge>
                                </Flex>
                                <Box>
                                <MultiSelect
                                    onValueChange={setSelectedNames}
                                    placeholder="Buscar..."
                                    className="max-w-lg"
                                >
                                    {dataGroups.map((group) => (
                                    <MultiSelectItem key={group.id} value={group.id}>
                                        Grupo #{group.id}
                                    </MultiSelectItem>
                                    ))}
                                </MultiSelect>
                                </Box>
                            </Flex>
                        <Text className="mt-2">Lista de Grupos Registrados</Text>

                        <Table className='mt-6'>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell>Número de grupo</TableHeaderCell>
                                    <TableHeaderCell>Máximo de estudiantes</TableHeaderCell>
                                    <TableHeaderCell>Tanda</TableHeaderCell>
                                    <TableHeaderCell>Acciones</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataGroups
                                .filter((group) => isGroupSelected(group))
                                .map(group => {
                                    return (
                                        <TableRow key={group.id}>
                                            <TableCell>{group.id}</TableCell>
                                            <TableCell>Grupo #{group.id}</TableCell>
                                            <TableCell>{group.maxStudents}</TableCell>
                                            <TableCell>
                                                {dataShifts.find(shift => shift.id === group.idShift)?.initialHour} {" "}
                                                - 
                                                {dataShifts.find(shift => shift.id === group.idShift)?.finishHour} {" "}
                                            </TableCell>
                                            <TableCell>
                                                <ButtonGroup variant='ghost' spacing='1'>
                                                    <IconButton onClick={() => handleShowData(group)}
                                                    colorScheme='blue' icon={<ViewIcon />} aria-label='Show'></IconButton>

                                                    <IconButton onClick={() => handleEditData(group)} colorScheme='green' icon={<EditIcon />} aria-label='Edit'></IconButton>

                                                    <IconButton onClick={() => handleDeleteData(group.id)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete'></IconButton>
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