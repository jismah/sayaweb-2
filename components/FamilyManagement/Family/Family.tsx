import { AddIcon, DeleteIcon, CheckIcon, ViewIcon, EditIcon} from '@chakra-ui/icons';
import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Box, Button, Flex, Center, Spinner, ButtonGroup, IconButton, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useColorMode, useDisclosure, useToast, Heading, Card, CardBody, Stack, NumberIncrementStepperProps } from '@chakra-ui/react';
import { FaceSmileIcon } from '@heroicons/react/24/solid';
import { User } from '@supabase/supabase-js';
// import { Props } from '@supabase/auth-ui-react/dist/components/Auth/UserContext';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Parents from '../../Students/Parents/Parents';
import _ from 'lodash';
import Students from '../../Students/Students/Students';


interface Student{
  id: string;
  name: string;
  lastName1: string;
  lastName2: string | null;
  dateBirth: string;
  housePhone: string;
  address: string;
  status: string;

  idFamily: string;
}

interface Parent {
  id: string;
  identityCard: string;
  name: string;
  lastName1: string;
  lastName2: string | null;
  telephone: string | null;
  email: string;
  occupation: string | null; 

  idFamily: string;
  children: Student[];
}

interface Family{
  id: string;
  students: Student[];
  parents: Family[];
  // user: User;
}

export default function Family() {
    
  const [dataFamilies, setDataFamilies] = useState<Family[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [enableEditing, setEnableEditing] = useState(false);
  const [showMode, setShowMode] = useState(false); // Estado para controlar el modo "mostrar"
  const [loading, setLoading] = useState(false);
  const [dataFamily, setDataFamily] = useState<Family>({
    id: "",
    students: [],
    parents: [],
  });
  const [dataParent, setDataParent] = useState<Parent>({
    id: "",
    identityCard: "",
    name: "",
    lastName1: "",
    lastName2: "",
    telephone: "",
    email: "",
    occupation: "",
    idFamily: "", 
    children: [],
  });

  const [familyStudents, setFamilyStudents] = useState<Student[]>([]);
  const [familyParents, setFamilyParents] = useState<Parent[]>([]);

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // GET DATA TO LOAD ARRAY
  const fetchData = async () => {
  setLoading(true); 

  try {
    const familiesResponse = await fetch(`http://localhost:3000/api/family?page=${currentPage}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "123456",
    },
    });
    const json = await familiesResponse.json();
    console.log(json);

    setDataFamilies(json.response); // ACTUALIZAR EL ESTADO
    setTotalRecords(json.total); // Establecer el total de registros
    setTotalPages(Math.ceil(json.total / pageSize)); // Calcular y establecer el total de páginas

    
  } catch (error) {
    console.error(error);
      // MANEJO DE ERRORES
    } finally {
      setLoading(false); 
    }
  }


  // CREATE DATA
  const handleOpenCreateModal = () => {

    setEditMode(false);
    setShowMode(false);
  }

  const handleCreateData =async (e:React.FormEvent) => {
    e.preventDefault()
    if(editMode){
      handleUpdateDate()
      onClose()
    }else{
      //FETCH TO PARENT


      //FETCH TO STUDENT

      
    }

    setEditMode(false);
    setShowMode(false);
  }

  // EDIT DATA
  const handleEditData = (family : Family) => {
    const selectedFamily = dataFamilies.find(f => f.id === family.id)!;

    setDataFamily(selectedFamily);
    onOpen();

    setEditMode(true);
    setEnableEditing(true);
  }

  const handleUpdateDate =async () => {


    onClose();
    setEditMode(false);
    fetchData();
  } 

  // DELETE DATA
  const handleDeleteData =async (id:string) => {
    const res = await fetch(`/api/family/${id}`, {
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
  const handleShowData = async (family: Family) => {
    const selectedFamily = dataFamilies.find(f => f.id === family.id)!;

    setDataFamily(selectedFamily);
    setShowMode(true); // Cambiar a modo "mostrar"
    onOpen()
    setLoading(true); 

    //Petición para obtener los demás cabeceras de la familia
    try {
      const response = await fetch(`http://localhost:3000/api/family/${selectedFamily?.id}/parents`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "123456",
      },
      });
      const json = await response.json();
      setFamilyParents(json.response);
    } catch (error) {
      console.error(error);
    }  finally {
      setLoading(false); 
    }

    //Petición para obtener los estudiantes (hijos)
    try {
      const response = await fetch(`http://localhost:3000/api/family/${selectedFamily?.id}/students`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "123456",
      },
      });
      const json = await response.json();
      setFamilyStudents(json.response);
    } catch (error) {
      console.error(error);
    }  finally {
      setLoading(false); 
    }
  }

  // PAGINATION
  const pageSize = 10; // Cantidad de elementos por página
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0); // Nuevo estado para el total de registros



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
            <Heading as='h3' size='xl' id='Parents' >Familias</Heading>
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
                    Nueva Familia
                </Button>
            </ButtonGroup>
          </Flex>

          <Modal onClose={() => { setShowMode(false); setEditMode(false);  setEnableEditing(false); onClose();}} size={'full'} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{editMode ? "Editar" : (showMode ? "Detalle" : "Crear") }</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box px={3} py={3}>
                    <form onSubmit={handleCreateData}>
                      <Stack spacing={4}>                     
                          


                        {/*Tablas pertenecientes para las relaciones */}

                        {/* Tabla los padres */}
                        {(showMode || editMode) && (
                          loading ? (
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

                              <Parents familyParents = {familyParents} familyMode={true} enableEditing={enableEditing}/>

                            </Box>
                          )
                        )}


                        {/* Tabla estudiantes(hijos) */}
                        {(showMode || editMode) && (
                          loading ? (
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

                              <Students familyStudents={familyStudents} familyMode={true} enableEditing={enableEditing}/>

                            </Box>
                          )
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
                                      <Th>Titulo</Th>
                                      <Th>Nombre de usuario</Th>
                                      <Th>Acciones</Th>
                                      </Tr>
                                  </Thead>
                                  <Tbody>
                                      {dataFamilies.map(family => {
                                          return (
                                              <Tr key={family.id}>
                                                <Td>{family.id}</Td>
                                                <Td>{"Apellido1Padre"} {"Apellido1Madre"} </Td>
                                                <Td>{"username"} </Td>
                                                <Td>
                                                    <ButtonGroup variant='ghost' spacing='1'>
                                                        <IconButton onClick={() => handleShowData(family)}
                                                        colorScheme='blue' icon={<ViewIcon />} aria-label='Show'></IconButton>

                                                        <IconButton onClick={() => handleEditData(family)} colorScheme='green' icon={<EditIcon />} aria-label='Edit'></IconButton>

                                                        <IconButton onClick={() => handleDeleteData(family.id)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete'></IconButton>
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
};


