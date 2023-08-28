import { AddIcon, DeleteIcon, CheckIcon, ViewIcon, EditIcon} from '@chakra-ui/icons';
import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Box, Button, Flex, Center, Spinner, ButtonGroup, IconButton, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useColorMode, useDisclosure, useToast, Heading, Card, CardBody, Stack, NumberIncrementStepperProps } from '@chakra-ui/react';
import { FaceSmileIcon } from '@heroicons/react/24/solid';
import { User } from '@supabase/supabase-js';
// import { Props } from '@supabase/auth-ui-react/dist/components/Auth/UserContext';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';


export interface Student{
  id: string;
  name: string;
  lastName1: string;
  lastName2: string | null;
  dateBirth: string;
  housePhone: string;
  address: string;
  status: string;
  commentary: string | null;
  medicalCondition: string | null;
  progressDesired: string | null;
  allowedPictures: boolean;

  idPediatrician: string;
  idCity: string;
  idProgram: string;
  idFamily: string;
  idParent: string;
}

import { Parent } from '../Parents/Parents';
import { Family } from '../../FamilyManagement/Family/Family';
import { Tutor } from '../Tutors/Tutor';
import { EmergencyContact } from '../EmergencyContacts/EmergencyContacts';
import StudentForm from '../../Inscriptions/StudentForm/StudentForm';
import { Evaluation } from '../../StudentProgram/Evaluations/Evaluations';
import { Program } from '../../StudentProgram/Programs/Programs';


export default function Students({familyStudents, dataFamily, familyMode, programMode, enableEditing} : {familyStudents : Student[]; dataFamily : Family; familyMode: boolean; enableEditing : boolean; programMode: boolean}) {
  
  
  const getInitialStudentData = () => {
    const initialData: Student = {
      id: "",
      name: "",
      lastName1: "",
      lastName2: "",
      housePhone: "",
      address: "",
      status: "",
      commentary: "",
      medicalCondition: "",
      progressDesired: "",
      allowedPictures: false,
      dateBirth: "",
      idPediatrician: "",
      idCity: "",
      idProgram: "",
      idFamily: familyMode ? familyStudents[0].idFamily : "", // Initialize idFamily conditionally
      idParent: familyMode ? familyStudents[0].idParent : "",
    };
    return initialData;
  };

  const initialStudentData = getInitialStudentData();
  
  const [dataStudents, setDataStudents] = useState<Student[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [showMode, setShowMode] = useState(false); // Estado para controlar el modo "mostrar"
  const [loading, setLoading] = useState(false);
  const [dataStudent, setDataStudent] = useState<Student>(initialStudentData);
  // const [dataParent, setDataParent] = useState<Parent>({
  //     id: "",
  //     identityCard: "",
  //     name: "",
  //     lastName1: "",
  //     lastName2: "",
  //     telephone: "",
  //     email: "",
  //     occupation: "",
  //     idFamily: "",
  //     children: [],
  // });
  const [familySiblings, setFamilySiblings] = useState<Student[]>([]);
  const [familyHeaders, setFamilyHeaders] = useState<Parent[]>([]);
  const [studentTutors, setstudentTutors] = useState<Tutor[]>([]);
  const [studentEmergencyContacts, setstudentEmergencyContacts] = useState<EmergencyContact[]>([]);

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // GET DATA TO LOAD ARRAY
  const fetchData = async () => {
    setLoading(true); 
    
    if (familyMode || programMode){
      setDataStudents(familyStudents);
      setLoading(false);
    } else {
      try {
        const studentsResponse = await fetch(`http://localhost:3000/api/students?page=${currentPage}&pageSize=${pageSize}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "123456",
        },
        });
        const json = await studentsResponse.json();
        console.log(json);
    
        setDataStudents(json.response); // ACTUALIZAR EL ESTADO
        setTotalRecords(json.total); // Establecer el total de registros
        setTotalPages(Math.ceil(json.total / pageSize)); // Calcular y establecer el total de páginas
    
        
      } catch (error) {
        console.error(error);
          // MANEJO DE ERRORES
        } finally {
          setLoading(false); 
        }
      
    }
  }

  

  // CREATE DATA
  const handleOpenCreateModal = () => {
    setDataStudent(initialStudentData);
    console.log('Crear student - Inicialiación de datos:');
    console.log(dataStudent);
    setEditMode(false);
    setShowMode(false);
    if(familyMode){
      setFamilyHeaders(dataFamily.parents);
      console.log('Al abrir create - Datos de los padres');
      console.log(dataFamily.parents);
    }

    onOpen();
  };

  const handleCreateData = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editMode) {
      handleUpdateDate()
      onClose()
    } else {
      const res = await fetch('http://localhost:3000/api/students/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "123456",
        },
        body: JSON.stringify({
          id: dataStudent.id,
          name: dataStudent.name,
          lastName1: dataStudent.lastName1,
          lastName2: dataStudent.lastName2,
          housePhone: dataStudent.housePhone,
          address: dataStudent.address,
          status: dataStudent.status,
          dateBirth: dataStudent.dateBirth,
          commentary: dataStudent.commentary,
          medicalCondition: dataStudent.medicalCondition,
          progressDesired: dataStudent.progressDesired,
          allowedPictures: dataStudent.allowedPictures,
        })
      });
      const json = await res.json();

      toast({
        title: 'Registro Creado!',
        description: "Se creo el registro correctamente.",
        status: 'success',
        position: 'bottom-right',
        duration: 4000,
        isClosable: true,
      });
      
    }
    
    setShowMode(false)
    setEditMode(false)
   
    fetchData();
  }

  // EDIT DATA
  const handleEditData = async (student: Student) => {
    const selectedStudent = dataStudents.find(s => s.id === student.id)!;
    
    setDataStudent(selectedStudent);
    onOpen();

    loadParentsAndSiblings(selectedStudent);
    
    setEditMode(true);
  }

  const handleUpdateDate = async () => {
    const res = await fetch(`http://localhost:3000/api/students/${dataStudent.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "123456",
      },
      body: JSON.stringify({
        id: dataStudent.id,
        name: dataStudent.name,
        lastName1: dataStudent.lastName1,
        lastName2: dataStudent.lastName2,
        housePhone: dataStudent.housePhone,
        address: dataStudent.address,
        status: dataStudent.status,
        dateBirth: dataStudent.dateBirth,
        commentary: dataStudent.commentary,
        medicalCondition: dataStudent.medicalCondition,
        progressDesired: dataStudent.progressDesired,
        allowedPictures: dataStudent.allowedPictures,
      })
    });
    const json = await res.json();
    console.log(json)
    onClose()
    setEditMode(false)
    fetchData()
  }

  // DELETE DATA
  const handleDeleteData = async (id: string) => {
    const res = await fetch(`/api/students/${id}`, {
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
  const handleShowData = async (student: Student) => {
    const selectedStudent = dataStudents.find(s => s.id === student.id)!;

    setDataStudent(selectedStudent);
    setShowMode(true); // Cambiar a modo "mostrar"
    onOpen();
    
    loadParentsAndSiblings(selectedStudent);
    
  }

  const loadParentsAndSiblings = async (selectedStudent : Student) => {
    setLoading(true); 

    //Petición para obtener los demás cabeceras de la familia
    try {
      const response = await fetch(`http://localhost:3000/api/family/${selectedStudent?.idFamily}/parents`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "123456",
      },
      });
      const json = await response.json();
      setFamilyHeaders(json.response);
      console.log("Respuesta de padres:")
      console.log(json.response);
    } catch (error) {
      console.error(error);
    }  finally {
      setLoading(false); 
    }

    //Petición para obtener los estudiantes (hermanos)
    try {
      const response = await fetch(`http://localhost:3000/api/family/${selectedStudent?.idFamily}/students`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "123456",
      },
      });
      const json = await response.json();
      setFamilySiblings(json.response);
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
            <Heading as='h3' size='xl' id='Parents' >Estudiantes</Heading>
              <Box display={enableEditing ? 'block' : 'none'}>
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
                    <Button onClick={handleOpenCreateModal} size='sm' leftIcon={<AddIcon />} variant={'outline'} color={'teal'} display={familyMode ? 'block' : 'none'}>
                        Nuevo Estudiante
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
                              
                              {!showMode && (
                                <StudentForm  dataParents={dataFamily.parents} dataStudent={dataStudent} editingMode={(editMode ? true : false)} createStudentWithFamily={true} />
                              )}
                              

                              {/*Tablas pertenecientes para las relaciones */}

                              {/* Tabla los padres */}
                              {showMode && (
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
                                  <FormLabel>Cabeceras de la familia</FormLabel>
                                  <Card variant={'outline'}>
                                      <CardBody p={0}>
                                      <TableContainer>
                                          <Table variant='striped'>
                                          <Thead>
                                              <Tr>
                                                  <Th>ID</Th>
                                                  <Th>Nombre Completo</Th>
                                                  <Th>Cedula</Th>
                                                  <Th>Telefono</Th>
                                                  <Th>Email</Th>
                                                  <Th>Ocupación</Th>
                                              </Tr>
                                          </Thead>
                                          <Tbody>
                                              {familyHeaders.map((parent: Parent) => {
                                                  return (
                                                      <Tr key={parent.id}>
                                                      <Td>{parent.id}</Td>
                                                      <Td>{parent.name} {parent.lastName1} {parent.lastName2}</Td>
                                                      <Td>{parent.identityCard}</Td>
                                                      <Td>{parent.telephone}</Td>
                                                      <Td>{parent.email}</Td>
                                                      <Td>{parent.occupation}</Td>
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
                              )
                              )}


                              {/* Tabla estudiantes(hermanos) */}
                              {showMode && (
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
                                  <FormLabel>Hermanos</FormLabel>
                                  <Card variant={'outline'}>
                                      <CardBody p={0}>
                                      <TableContainer>
                                          <Table variant='striped'>
                                          <Thead>
                                              <Tr>
                                                  <Th>ID</Th>
                                                  <Th>Nombre Completo</Th>
                                                  <Th>Telefono</Th>
                                                  <Th>Dirección</Th>
                                                  <Th>Fecha de nacimiento</Th>
                                              </Tr>
                                          </Thead>
                                          <Tbody>
                                              {familySiblings.map((student: Student) => {
                                                  return (
                                                      <Tr key={student.id}>
                                                      <Td>{student.id}</Td>
                                                      <Td>{student.name} {student.lastName1} {student.lastName2}</Td>
                                                      <Td>{student.housePhone}</Td>
                                                      <Td>{student.address}</Td>
                                                      <Td>{student.dateBirth}</Td>
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
                              )
                              )}

                              {/* Tabla tutores */}
                              {/* {showMode && (
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
                                  <FormLabel>Hermanos</FormLabel>
                                  <Card variant={'outline'}>
                                      <CardBody p={0}>
                                      <TableContainer>
                                          <Table variant='striped'>
                                          <Thead>
                                              <Tr>
                                                  <Th>ID</Th>
                                                  <Th>Nombre Completo</Th>
                                                  <Th>Telefono</Th>
                                                  <Th>Dirección</Th>
                                                  <Th>Fecha de nacimiento</Th>
                                              </Tr>
                                          </Thead>
                                          <Tbody>
                                              {familySiblings.map((student: Student) => {
                                                  return (
                                                      <Tr key={student.id}>
                                                      <Td>{student.id}</Td>
                                                      <Td>{student.name} {student.lastName1} {student.lastName2}</Td>
                                                      <Td>{student.housePhone}</Td>
                                                      <Td>{student.address}</Td>
                                                      <Td>{student.dateBirth}</Td>
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
                              )
                              )} */}

                              {/* Tabla contactos de emergencia */}
                              {/* {showMode && (
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
                                  <FormLabel>Hermanos</FormLabel>
                                  <Card variant={'outline'}>
                                      <CardBody p={0}>
                                      <TableContainer>
                                          <Table variant='striped'>
                                          <Thead>
                                              <Tr>
                                                  <Th>ID</Th>
                                                  <Th>Nombre Completo</Th>
                                                  <Th>Telefono</Th>
                                                  <Th>Dirección</Th>
                                                  <Th>Fecha de nacimiento</Th>
                                              </Tr>
                                          </Thead>
                                          <Tbody>
                                              {familySiblings.map((student: Student) => {
                                                  return (
                                                      <Tr key={student.id}>
                                                      <Td>{student.id}</Td>
                                                      <Td>{student.name} {student.lastName1} {student.lastName2}</Td>
                                                      <Td>{student.housePhone}</Td>
                                                      <Td>{student.address}</Td>
                                                      <Td>{student.dateBirth}</Td>
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
                              )
                              )} */}




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
                                        <Th>Nombre Completo</Th>
                                        <Th>Telefono</Th>
                                        <Th>Dirección</Th>
                                        <Th>Estado</Th>
                                        <Th>Fecha de nacimiento</Th>
                                        <Th>Condición médica</Th>
                                        <Th>Progreso deseado</Th>
                                        <Th>Permiso para fotos</Th>
                                        <Th>Acciones</Th>
                                      </Tr>
                                  </Thead>
                                  <Tbody>
                                      {dataStudents.map(student => {
                                          return (
                                              <Tr key={student.id}>
                                                <Td>{student.id}</Td>
                                                <Td>{student.name} {student.lastName1} {student.lastName2}</Td>
                                                <Td>{student.housePhone}</Td>
                                                <Td>{student.address}</Td>
                                                <Td>{student.status}</Td>
                                                <Td>{student.dateBirth}</Td>
                                                <Td>{student.medicalCondition}</Td>
                                                <Td>{student.progressDesired}</Td>
                                                <Td>{student.allowedPictures ? "Permitido" : "No permitido"}</Td>
                                                <Td>
                                                    <ButtonGroup variant='ghost' spacing='1'>
                                                        <IconButton onClick={() => handleShowData(student)}
                                                        colorScheme='blue' icon={<ViewIcon />} aria-label='Show'></IconButton>

                                                        <IconButton onClick={() => handleEditData(student)} colorScheme='green' icon={<EditIcon />} aria-label='Edit' display={enableEditing ? 'block' : 'none'}></IconButton>

                                                        <IconButton onClick={() => handleDeleteData(student.id)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete' display={(familyMode && enableEditing) ? 'block' : 'none'}></IconButton>
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

