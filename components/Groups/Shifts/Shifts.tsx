import { AcademicYear } from "../../Campaments/AcademicYear/AcademicYear";
import { WeekDay } from "../WeekDays/WeekDays";

export interface Shift{
    id: string;
    initialHour: string;
    finishHour: string;

    idStaff: string;

    idAcademicYear: string;

    idWeekDay: string;
}


import { Student } from "../../Students/Students/Students";
import { Professor, Staff } from "../../StaffAdministrator/Staff/Staff";
import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Card, CardBody, Checkbox, Flex, FormControl, FormLabel, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Spinner, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";

//Select
import { Select } from "@chakra-ui/react";
//MultiSelect
import { MultiSelect, MultiSelectItem } from "@tremor/react";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";

  
  
export default function Shifts(){

    const initialShiftData : Shift = {
        id: "",
        initialHour: "",
        finishHour: "",
        idStaff: "",
        idAcademicYear: "",
        idWeekDay: "",
    };
    const [dataShift, setDataShift] = useState<Shift>(initialShiftData);
    const [dataShifts, setDataShifts] = useState<Shift[]>([]);

    //Relaciones con otras tablas: 
    const [dataAcademicYears, setDataAcademicYears] = useState<AcademicYear[]>([]);
    const [dataWeekDays, setDataWeekDays] = useState<WeekDay[]>([]);    
    const [dataStaffs, setDataStaffs] = useState<Staff[]>([]);

    const [selectedWeekDayId, setSelectedWeekDayId] = useState<string | undefined>(dataShift.idWeekDay);
    const [selectedAcademicYearId, setSelectedAcademicYearId] = useState<string | undefined>(dataShift.idAcademicYear);
    const [selectedStaffId, setSelectedStaffId] = useState<string | undefined>(dataShift.idStaff);

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


      

    // Lógica para crear el grupo (enviar los datos al servidor, etc.)

    // GET DATA TO LOAD ARRAY
    const fetchData = async () => {
        setLoading(true);
        try{
            const res = await fetch(`http://localhost:3000/api/shifts?page=${currentPage}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "123456",
            },
            });
            const json = await res.json();
            console.log(json);
        
            setDataShifts(json.response); // ACTUALIZAR EL ESTADO
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
        setDataShift(initialShiftData);
        setEditMode(false);
        setShowMode(false);

        fetchSelects();

        onOpen();
    };

    const handleCreateData = async (e: React.FormEvent) => {
        e.preventDefault()

        if(editMode){
            handleUpdateData()
            onClose()
        }else{
            const res = await fetch('http://localhost:3000/api/shifts/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
                body: JSON.stringify({
                    id: dataShift.id,
                    initialHour: dataShift.initialHour,
                    finishHour: dataShift.finishHour,
                    idStaff: selectedStaffId,
                    idAcademicYear: selectedAcademicYearId,
                    idWeekDay: selectedWeekDayId,
                })
            });
            const json = await res.json();
            console.log(json);

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
    const handleEditData = async (shift: Shift) => {
        const selectedShifts = dataShifts.find(s => s.id === shift.id)!;
        
        setDataShift(selectedShifts);
        onOpen();

        
        setEditMode(true);
    };

    const handleUpdateData = async () =>{
        const res = await fetch(`http://localhost:3000/api/shifts/${dataShift.id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "123456",
        },
        body: JSON.stringify({
            id: dataShift.id,
            initialHour: dataShift.initialHour,
            finishHour: dataShift.finishHour,
            idStaff: dataShift.idStaff,
            idAcademicYear: dataShift.idAcademicYear,
            idWeekDay: dataShift.idWeekDay,
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
        const res = await fetch(`http://localhost:3000/api/shifts/${id}`, {
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
    const handleShowData = async (shift: Shift) => {
        const selectedShifts = dataShifts.find(s => s.id === shift.id)!;

        setDataShift(selectedShifts);
        setShowMode(true); // Cambiar a modo "mostrar"
        onOpen();

    };

    const fetchSelects = async () => {
        setLoading(true);
        try {
            const citiesResponse = await fetch('http://localhost:3000/api/academicYears', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
            });
            const jsonAcademicYears = await citiesResponse.json();
            console.log(jsonAcademicYears);
            setDataAcademicYears(jsonAcademicYears.response); 

            const staffResponse = await fetch('http://localhost:3000/api/staff', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
            });
            const jsonStaff = await staffResponse.json();
            console.log(jsonStaff);
            setDataStaffs(jsonStaff.response);

            const weekDaysResponse = await fetch('http://localhost:3000/api/weekDays', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
            });
            const jsonWeekDays = await weekDaysResponse.json();
            console.log(jsonWeekDays);
            setDataWeekDays(jsonWeekDays.response); 

        } catch (error) {
            console.error(error);
            // MANEJO DE ERRORES
        }finally{
            setLoading(false);
        }
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
                <Flex justifyContent={'space-between'} alignItems={'center'} mt={'40px'}>
                    <Heading as='h3' size='xl' id='Parents' >Tandas</Heading>
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
                                Nueva tanda
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
                                    <SimpleGrid columns={2} spacing={10} mb={3}>
                                        <FormControl isRequired>
                                            <FormLabel>Hora inicial</FormLabel>
                                            <Input placeholder="Hora inicial" value={dataShift.initialHour || ""}  readOnly={showMode} type='time'  onChange={(e) => {
                                                const inputValue = e.target.value;
                                                const formattedValue = inputValue ? `${inputValue}:00` : "";
                                                setDataShift({ ...dataShift, initialHour: formattedValue });
                                            }} />
                                        </FormControl>

                                        <FormControl isRequired>
                                            <FormLabel>Hora final</FormLabel>
                                            <Input placeholder="Hora final" value={dataShift.finishHour || ""}  readOnly={showMode} type='time'  onChange={(e) => {
                                                const inputValue = e.target.value;
                                                const formattedValue = inputValue ? `${inputValue}:00` : "";
                                                setDataShift({ ...dataShift, finishHour: formattedValue });
                                            }} />
                                        </FormControl>
                                    </SimpleGrid>


                                    
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
                                        <Box>
                                            <SimpleGrid columns={2} spacing={10} mb={3}>
                                                <FormControl isRequired>
                                                    <FormLabel>Año académico</FormLabel>
                                                    <Select value={selectedAcademicYearId} onChange={(e) => setSelectedAcademicYearId(e.target.value)} placeholder='Seleccionar año académico'>
                                                        {dataAcademicYears.map(academicYear => (
                                                            <option key={academicYear.id} value={academicYear.id}>
                                                                {academicYear.startTime} - {academicYear.endTime}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                <FormControl isRequired>
                                                    <FormLabel>Día de la semana</FormLabel>
                                                    <Select value={selectedWeekDayId} onChange={(e) => setSelectedWeekDayId(e.target.value)} placeholder='Seleccionar día de semana'>
                                                        {dataWeekDays.map(weekDay => (
                                                            <option key={weekDay.id} value={weekDay.id}>
                                                                {weekDay.name}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </SimpleGrid>

                                            <SimpleGrid columns={2} spacing={10}>
                                                <FormControl isRequired>
                                                    <FormLabel>Empleado</FormLabel>
                                                    <Select value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} placeholder='Seleccionar empleado'>
                                                        {dataStaffs.map(staff => (
                                                            <option key={staff.id} value={staff.id}>
                                                                {staff.name} {staff.lastName1} {staff.lastName2}
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
                                            <Th>Hora inicial</Th>
                                            <Th>Hora final</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {dataShifts.map(shift => {
                                            return (
                                                <Tr key={shift.id}>
                                                    <Td>{shift.id}</Td>
                                                    <Td>{shift.initialHour}</Td>
                                                    <Td>{shift.finishHour}</Td>
                                                    <Td>
                                                        <ButtonGroup variant='ghost' spacing='1'>
                                                            <IconButton onClick={() => handleShowData(shift)}
                                                            colorScheme='blue' icon={<ViewIcon />} aria-label='Show'></IconButton>

                                                            <IconButton onClick={() => handleEditData(shift)} colorScheme='green' icon={<EditIcon />} aria-label='Edit'></IconButton>

                                                            <IconButton onClick={() => handleDeleteData(shift.id)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete'></IconButton>
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