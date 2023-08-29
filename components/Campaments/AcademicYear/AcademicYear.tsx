
import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, CardBody, Flex, FormControl, FormLabel, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Spinner, Stack, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";

import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";

import { Card, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Table, Badge, Text, MultiSelect, MultiSelectItem } from '@tremor/react';
import { DateTime } from "luxon";

export interface AcademicYear{
    id: string;
    startTime: string;
    endTime: string;
}
  
  
export default function AcademicYears(){

    const initialAcademicYearData : AcademicYear = {
        id: "",
        startTime: "",
        endTime: "",
    };
    const [dataAcademicYear, setDataAcademicYear] = useState<AcademicYear>(initialAcademicYearData);
    const [dataAcademicYears, setDataAcademicYears] = useState<AcademicYear[]>([]);


    const [editMode, setEditMode] = useState(false);
    const [showMode, setShowMode] = useState(false); // Estado para controlar el modo "mostrar"
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [selectedNames, setSelectedNames] = useState<string[]>([]);
    const isAcademiYearSelected = (academicYear: AcademicYear) =>
    selectedNames.includes(academicYear.id) || selectedNames.length === 0;
    

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
            const res = await fetch(`https://sayaserver.onrender.com/api/academicYears?page=${currentPage}&pageSize=${pageSize}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "123456",
            },
            });
            const json = await res.json();
            console.log(json);
        
            setDataAcademicYears(json.response); // ACTUALIZAR EL ESTADO
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
        setDataAcademicYear(initialAcademicYearData);
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
            const res = await fetch('https://sayaserver.onrender.com/api/academicYears/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
                body: JSON.stringify({
                    id: dataAcademicYear.id,
                    startTime: dataAcademicYear.startTime,
                    endTime: dataAcademicYear.endTime,
                })
            });
            const json = await res.json();
            console.log(json);

            setDataAcademicYear(initialAcademicYearData);

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
    const handleEditData = async (academicYear: AcademicYear) => {
        const selectedWeekDay = dataAcademicYears.find(ay => ay.id === academicYear.id)!;
        
        setDataAcademicYear(selectedWeekDay);
        onOpen();

        
        setEditMode(true);
    };

    const handleUpdateData = async () =>{
        const res = await fetch(`https://sayaserver.onrender.com/api/academicYears/${dataAcademicYear.id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "123456",
        },
        body: JSON.stringify({
            id: dataAcademicYear.id,
            startTime: dataAcademicYear.startTime,
            endTime: dataAcademicYear.endTime,
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
        const res = await fetch(`https://sayaserver.onrender.com/api/academicYears/${id}`, {
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
    const handleShowData = async (academicYear: AcademicYear) => {
        const selectedWeekDay = dataAcademicYears.find(ay => ay.id === academicYear.id)!;

        setDataAcademicYear(selectedWeekDay);
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
                <Flex justifyContent={'space-between'} alignItems={'center'} mt={'40px'}>
                    <Box>
                        <ButtonGroup>
                            <Button onClick={handleOpenCreateModal} size='sm' leftIcon={<AddIcon />} variant={'outline'} color={'teal'}>
                                Nuevo año académico
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

                                    <SimpleGrid columns={2} spacing={10}>
                                        <FormControl isRequired>
                                            <FormLabel>Fecha inicial</FormLabel>
                                            <Input placeholder="Fecha inicial" value={dataAcademicYear.startTime || ""} type='date' readOnly={showMode}  onChange={(e) => setDataAcademicYear({ ...dataAcademicYear, startTime: e.target.value })} />
                                        </FormControl>

                                        <FormControl isRequired>
                                            <FormLabel>Fecha final</FormLabel>
                                            <Input placeholder="Fecha final" value={dataAcademicYear.endTime || ""} type='date' readOnly={showMode}  onChange={(e) => setDataAcademicYear({ ...dataAcademicYear, endTime: e.target.value })} />
                                        </FormControl>
                                    </SimpleGrid>


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
                                <Heading size='md' id='tutores'>Años Académicos</Heading>
                                <Badge color="gray">{dataAcademicYears.length}</Badge>
                            </Flex>
                            <Box>
                                <MultiSelect
                                    onValueChange={setSelectedNames}
                                    placeholder="Buscar..."
                                    className="max-w-lg"
                                >
                                    {dataAcademicYears.map((academicYear) => (
                                    <MultiSelectItem key={academicYear.id} value={academicYear.id}>
                                        {academicYear.startTime} - {academicYear.endTime}
                                    </MultiSelectItem>
                                    ))}
                                </MultiSelect>
                            </Box>
                        </Flex>
                        <Text className="mt-2">Lista de Años Académicos Registrados</Text>

                        <Table className='mt-6'>
                            <TableHead>
                                <TableRow>
                                    <TableHeaderCell>ID</TableHeaderCell>
                                    <TableHeaderCell>Fecha inicial</TableHeaderCell>
                                    <TableHeaderCell>Fecha final</TableHeaderCell>
                                    <TableHeaderCell>Acciones</TableHeaderCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataAcademicYears
                                .filter((academicYear) => isAcademiYearSelected(academicYear))
                                .map(academicYear => {
                                    return (
                                        <TableRow key={academicYear.id}>
                                            <TableCell>{academicYear.id}</TableCell>
                                            <TableCell>
                                                {DateTime.fromISO(academicYear.startTime)
                                                .setLocale('es')
                                                .toFormat('MMMM dd, yyyy')
                                                .replace(/^\w/, firstChar => firstChar.toUpperCase())}
                                            </TableCell>
                                            <TableCell>
                                                {DateTime.fromISO(academicYear.endTime)
                                                .setLocale('es')
                                                .toFormat('MMMM dd, yyyy')
                                                .replace(/^\w/, firstChar => firstChar.toUpperCase())}
                                            </TableCell>
                                            <TableCell>
                                                <ButtonGroup variant='ghost' spacing='1'>
                                                    <IconButton onClick={() => handleShowData(academicYear)}
                                                    colorScheme='blue' icon={<ViewIcon />} aria-label='Show'></IconButton>

                                                    <IconButton onClick={() => handleEditData(academicYear)} colorScheme='green' icon={<EditIcon />} aria-label='Edit'></IconButton>

                                                    <IconButton onClick={() => handleDeleteData(academicYear.id)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete'></IconButton>
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