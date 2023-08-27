import { Shift } from "../Shifts/Shifts";
import { Student } from "../../Students/Students/Students";
import { Staff } from "../../StaffAdministrator/Staff/Staff";
import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Card, CardBody, Checkbox, Flex, Heading, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Spinner, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";

//Select
import { Select, SelectItem } from "@tremor/react";
//MultiSelect
import { MultiSelect, MultiSelectItem } from "@tremor/react";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";


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

    // PAGINATION
    const pageSize = 10; // Cantidad de elementos por página
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0); // Nuevo estado para el total de registros

    

    //Iniciar listado de Estudiantes, Profesores y de la tanda(Shift)
    // const [selectedStudents, setSelectedStudents] = useState<StudentOnGroup[]>([]);
    // const [selectedProfessors, setSelectedProfessors] = useState<Professor[]>([]);
    // const [selectedShift, setSelectedShift] = useState<Shift>(initialShiftData);

    // Lógica para manejar la selección de estudiantes y profesores
    // const [selectedProfessors, setSelectedProfessors] = useState<string[]>([]);
    // const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    // const [selectedShift, setSelectedShift] = useState<string>("");

    // const handleProfessorsSelect = (selectedItems: Professor[]) => {
    //     setSelectedProfessors(selectedItems);
    // };

    // const handleStudentSelect = (selectedItems: Student[]) => {
    //     setSelectedStudents(selectedItems);
    // };

    // const handleShiftSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     setSelectedShift(event.target.value);
    // };
      
    
      

    // Lógica para crear el grupo (enviar los datos al servidor, etc.)

    // GET DATA TO LOAD ARRAY
    const fetchData = async () => {
        setLoading(true);
        try{
            const res = await fetch(`http://localhost:3000/api/groups?page=${currentPage}&pageSize=${pageSize}`, {
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

        loadGroupInformation();

        onOpen();
    };

    const handleCreateData = async (e: React.FormEvent) => {
        e.preventDefault()
        if(editMode){
            handleUpdateData()
            onClose()
        }else{
            const resGroups = await fetch('http://localhost:3000/api/groups/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
                body: JSON.stringify({
                    id: dataGroup.id,
                    maxStudents: dataGroup.maxStudents,
                    idShift: valueShift,
                })
            });
            const jsonGroups = await resGroups.json();
            console.log(jsonGroups);
            toast({
                title: 'Registro Creado!',
                description: "Se creo el registro correctamente.",
                status: 'success',
                position: 'bottom-right',
                duration: 4000,
                isClosable: true,
            });


            const resStudents = await fetch('http://localhost:3000/api/studentOnGroup/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
                body: JSON.stringify({
                    id: dataGroup.id,
                    maxStudents: dataGroup.maxStudents,
                    idShift: valueShift,
                })
            });
            const jsonStudents = await resStudents.json();
            console.log(jsonStudents);
            toast({
                title: 'Registro Creado!',
                description: "Se creo el registro correctamente.",
                status: 'success',
                position: 'bottom-right',
                duration: 4000,
                isClosable: true,
            });


            const resProfessor = await fetch('http://localhost:3000/api/professorsForGroup/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
                body: JSON.stringify({
                    idProfessor: dataGroup
                })
            });
            const jsonProfessor = await resProfessor.json();
            console.log(jsonProfessor);
            toast({
                title: 'Registro Creado!',
                description: "Se creo el registro correctamente.",
                status: 'success',
                position: 'bottom-right',
                duration: 4000,
                isClosable: true,
            });

            
            const resCamps = await fetch('http://localhost:3000/api/groupOnCamp/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
                body: JSON.stringify({
                    id: dataGroup.id,
                    maxStudents: dataGroup.maxStudents,
                    idShift: valueShift,
                })
            });
            const jsonCamp = await resCamps.json();
            console.log(jsonCamp);
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

        loadGroupInformation();
        
        setEditMode(true);
    };

    const handleUpdateData = async () =>{
        const res = await fetch(`http://localhost:3000/api/groups/${dataGroup.id}`, {
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
        const res = await fetch(`http://localhost:3000/api/groups/${id}`, {
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

        loadGroupInformation();
    };

    //Cargar lista de estudiantes, profesores y tandas
    const loadGroupInformation = async () => {
        setLoading(true); 

        //Petición para obtener los demás cabeceras de la familia
        try{
        const response = await fetch(`http://localhost:3000/api/groups/info`, {
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
    }, [currentPage]);

    


    return (
        <>
            <Box px={3} py={3}>
                <Flex justifyContent={'space-between'} alignItems={'center'} mt={'40px'}>
                    <Heading as='h3' size='xl' id='Parents' >Grupos</Heading>
                    <Box>
                        <ButtonGroup>
                            <Button size='sm' variant={'ghost'}>
                                Button #4
                            </Button>
                            <Button size='sm' variant={'ghost'}>
                                Button #3
                            </Button>
                            <Button size='sm' variant={'ghost'}>
                                Button #2
                            </Button>
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
                                        <Card variant={'outline'}>
                                            <CardBody>
                                                <Box height={'10vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                                    <Spinner color='teal' size='xl' thickness='3px' />
                                                </Box>
                                            </CardBody>
                                        </Card>
                                        </Box>
                                    ) : (
                                        <Box pt={4}>
                                            <SimpleGrid columns={2} spacing={10} mb={3}>
                                                <Box>
                                                    {/* Multiselect profesores */}
                                                    <Heading as='h3' size='md' id='professors' >Profesores</Heading>
                                                    <MultiSelect value={valueProfessors} onValueChange={setValueProfessors}>
                                                    {dataProfessors.map((professor) => (
                                                        <SelectItem key={professor.id} value={professor.id}>
                                                        {professor.staff.name} {professor.staff.lastName1} {professor.staff.lastName2}
                                                        </SelectItem>
                                                    ))}
                                                    </MultiSelect>
                                                </Box>

                                                <Box>
                                                    {/* Multiselect estudiantes */}
                                                    <Heading as='h3' size='md' id='students'>Estudiantes</Heading>
                                                    <MultiSelect value={valueStudents} onValueChange={setValueStudents}  >
                                                    {dataStudents.map((student) => (
                                                        <SelectItem key={student.id} value={student.id}  >
                                                        {student.name} {student.lastName1} {student.lastName2}
                                                        </SelectItem>
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
                    <Card variant={'outline'}>
                        <CardBody>
                            <Box height={'80vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Spinner color='teal' size='xl' thickness='3px' />
                            </Box>
                        </CardBody>
                    </Card>
                </Box>
                : <Box pt={4}>
                    <Card variant={'outline'}>
                        <CardBody p={0}>
                            <TableContainer>
                                <Table variant='striped'>
                                    <Thead>
                                        <Tr>
                                            <Th>ID</Th>
                                            <Th>Número de grupo</Th>
                                            <Th>Máximo de estudiantes</Th>
                                            <Th>Acciones</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {dataGroups.map(group => {
                                            return (
                                                <Tr key={group.id}>
                                                    <Td>{group.id}</Td>
                                                    <Td>Grupo #{group.id}</Td>
                                                    <Td>{group.maxStudents}</Td>
                                                    <Td>
                                                        <ButtonGroup variant='ghost' spacing='1'>
                                                            <IconButton onClick={() => handleShowData(group)}
                                                            colorScheme='blue' icon={<ViewIcon />} aria-label='Show'></IconButton>

                                                            <IconButton onClick={() => handleEditData(group)} colorScheme='green' icon={<EditIcon />} aria-label='Edit'></IconButton>

                                                            <IconButton onClick={() => handleDeleteData(group.id)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete'></IconButton>
                                                        </ButtonGroup>
                                                    </Td>
                                                </Tr>
                                            )
                                        })
                                        }
                                    </Tbody>

                                </Table>
                            </TableContainer>
                        </CardBody>
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