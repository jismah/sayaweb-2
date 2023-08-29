import { Evaluation } from "../Evaluations/Evaluations";




import { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Card, CardBody, Flex, FormControl, FormLabel, Heading, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Spinner, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr, useDisclosure, useToast } from "@chakra-ui/react";

//Select
import { Select } from "@chakra-ui/react";
//MultiSelect
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { Program } from "../Programs/Programs";

  
export interface Objective{
    id: string;
    title: string;
    mark: string;

    idProgram: string;
    idEvaluation: string;
}
  
export default function Objectives({dataObjectives, programMode} : {dataObjectives: Objective[], programMode : boolean}){


    const initialObjectiveData : Objective = {
        id: "",
        title: "",
        mark: "",
        idProgram: "", // Initialize idFamily conditionally
        idEvaluation: "",
    };

    const [dataObjective, setDataObjective] = useState<Objective>(initialObjectiveData);
    const [dataObjectivesLocal, setDataObjectivesLocal] = useState<Objective[]>([]);

    const [dataEvaluations, setDataEvaluations] = useState<Evaluation[]>([]);

    const [selectedEvaluationId, setSelectedEvaluationId] = useState<string | undefined>(dataObjective.idEvaluation);
    const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(dataObjective.idProgram);


    const [dataPrograms, setDataPrograms] = useState<Program[]>([]);


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

        if(programMode){
            setDataObjectivesLocal(dataObjectives);
            setLoading(false);
        }else{
            try{
                const res = await fetch(`https://sayaserver.onrender.com/api/objetives?page=${currentPage}&pageSize=${pageSize}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
                });
                const json = await res.json();
                console.log(json);
            
                setDataObjectivesLocal(json.response); // ACTUALIZAR EL ESTADO
                setTotalRecords(json.total); // Establecer el total de registros
                setTotalPages(Math.ceil(json.total / pageSize)); // Calcular y establecer el total de páginas
                
            } catch (error) {
                console.error(error);
                // MANEJO DE ERRORES
                } finally {
                setLoading(false); 
                }
        }
    };


    // CREATE DATA
    const handleOpenCreateModal = () => {
        setDataObjective(initialObjectiveData);
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
            const res = await fetch('https://sayaserver.onrender.com/api/objetives/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
                body: JSON.stringify({
                    title: dataObjective.title.toString(), 
                    mark: dataObjective.mark.toString(),
                    idProgram: selectedProgramId?.toString(),
                    idEvaluation: selectedEvaluationId?.toString(),
                })
            });
            const json = await res.json();
            console.log(json);

            setDataObjective(initialObjectiveData);
            

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
    const handleEditData = async (objectives: Objective) => {
        const selectedObjective = dataObjectivesLocal.find(o => o.id === objectives.id)!;
        
        setDataObjective(selectedObjective);
        onOpen();
        
        setEditMode(true);
    };

    const handleUpdateData = async () =>{
        const res = await fetch(`https://sayaserver.onrender.com/api/objetives/${dataObjective.id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "123456",
        },
        body: JSON.stringify({
            id: dataObjective.id.toString(),
            title: dataObjective.title.toString(), 
            mark: dataObjective.mark.toString(),
            idProgram: dataObjective.idProgram.toString(),
            idEvaluation: dataObjective.idEvaluation.toString(),
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
        const res = await fetch(`https://sayaserver.onrender.com/api/objetives/${id}`, {
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
    const handleShowData = async (objectives: Objective) => {
        const selectedObjective = dataObjectivesLocal.find(o => o.id === objectives.id)!;

        setDataObjective(selectedObjective);
        setShowMode(true); // Cambiar a modo "mostrar"
        onOpen();
    };



    const handlePageChange = (newPage: number) => {
        console.log("Changing page to:", newPage);
        setCurrentPage(prevPage => newPage);
    };
    

    useEffect(() => {
        fetchData();

        fetchRelations();
    }, [currentPage]);


    useEffect(() => {

        setSelectedEvaluationId(dataObjective.idEvaluation);
        setSelectedProgramId(dataObjective.idProgram);
        
    }, [dataObjective.idEvaluation, dataObjective.idProgram]);


    const fetchRelations = async () => {
        setLoading(true);
        try {

            const responseEvaluations = await fetch(`https://sayaserver.onrender.com/api/evaluations/${dataObjective.idEvaluation}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
            });
            const jsonEvaluations = await responseEvaluations.json();
            console.log(jsonEvaluations);            
            setDataEvaluations(jsonEvaluations.response); 


            const responsePrograms = await fetch(`https://sayaserver.onrender.com/api/programs/`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
            });
            const jsonProgram = await responsePrograms.json();
            console.log(jsonProgram);            
            setDataPrograms(jsonProgram.response); 
            

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
                    <Heading as='h3' size='xl' id='Parents' >Objetivos</Heading>
                    <Box>
                        <ButtonGroup>
                            {!programMode && <Button onClick={handleOpenCreateModal} size='sm' leftIcon={<AddIcon />} variant={'outline'} color={'teal'}>
                                Nuevo objetivo
                            </Button>}
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
                                            <FormLabel>Título</FormLabel>
                                            <Input placeholder="Título" value={dataObjective.title || ""} type='text' readOnly={showMode}  onChange={(e) => setDataObjective({ ...dataObjective, title: e.target.value })} />
                                        </FormControl>

                                        <FormControl isRequired>
                                            <FormLabel>Nota</FormLabel>
                                            <Input type="text" list="list-marks" placeholder="Escriba la nota"
                                            value={dataObjective.mark || ""} readOnly={showMode}
                                            onChange={(e) => setDataObjective({ ...dataObjective, mark: e.target.value })} />
                                            <datalist id="list-marks">
                                                <option value="Excelente"></option>
                                                <option value="Bueno"></option>
                                                <option value="Fallido"></option>
                                            </datalist>
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
                                    ): (
                                        <Box>

                                            <SimpleGrid columns={2} spacing={2}>
                                                <FormControl isRequired>
                                                    <FormLabel>Evaluación</FormLabel>
                                                    <Select value={selectedEvaluationId} onChange={(e) => setSelectedEvaluationId(e.target.value)} placeholder='Seleccionar evaluación'>
                                                        {dataEvaluations.map(evaluation => (
                                                            <option key={evaluation.id} value={evaluation.id}>
                                                                Comentario: {evaluation.commment}        |       Fecha: {evaluation.date}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>



                                                <FormControl isRequired>
                                                    <FormLabel>Programa</FormLabel>
                                                    <Select
                                                        value={selectedProgramId}
                                                        onChange={(e) => setSelectedProgramId(e.target.value)}
                                                        placeholder='Seleccionar programa'
                                                    >
                                                        {dataPrograms.map(program => (
                                                            <option key={program.id} value={program.id}>
                                                                {program.description}
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
                                            <Th>Título</Th>
                                            <Th>Nota</Th>
                                            <Th>Evaluación</Th>
                                            <Th>Programa</Th>
                                            <Td>Acciones</Td>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {dataObjectivesLocal.map(objective => {
                                            return (
                                                <Tr key={objective.id}>
                                                    <Td>{objective.id}</Td>
                                                    <Td>{objective.title}</Td>
                                                    <Td>{objective.mark}</Td>
                                                    <Td>
                                                        {dataEvaluations.find(evaluation => evaluation.id === objective.idEvaluation)?.commment} {" "}
                                                    </Td>
                                                    <Td>
                                                        {dataPrograms.find(program => program.id === objective.idProgram)?.description} {" "}
                                                    </Td>
                                                    <Td>
                                                        <ButtonGroup variant='ghost' spacing='1'>
                                                            <IconButton onClick={() => handleShowData(objective)}
                                                            colorScheme='blue' icon={<ViewIcon />} aria-label='Show'></IconButton>

                                                            {!programMode && (
                                                                <Box>
                                                                    <IconButton onClick={() => handleEditData(objective)} colorScheme='green' icon={<EditIcon />} aria-label='Edit'></IconButton>

                                                                    <IconButton onClick={() => handleDeleteData(objective.id)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete'></IconButton>
                                                                </Box>
                                                            )}
                                                            
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