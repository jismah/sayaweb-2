import { AddIcon, DeleteIcon, CheckIcon, ViewIcon, EditIcon} from '@chakra-ui/icons';
import { TableContainer, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Box, Button, Flex, Center, Spinner, ButtonGroup, IconButton, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useColorMode, useDisclosure, useToast, Heading, CardBody, Stack, NumberIncrementStepperProps, SimpleGrid } from '@chakra-ui/react';
import { FaceSmileIcon } from '@heroicons/react/24/solid';
import { User } from '@supabase/supabase-js';
// import { Props } from '@supabase/auth-ui-react/dist/components/Auth/UserContext';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';

import { Card, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Table, Color, Badge, Title, Text, MultiSelect, MultiSelectItem } from '@tremor/react';


import { Student } from '../../Students/Students/Students';

import { Family } from '../../FamilyManagement/Family/Family';

export interface Parent {
  id: string;
  identityCard: string;
  name: string;
  lastName1: string;
  lastName2: string | null;
  telephone: string ;
  email: string;
  occupation: string | null; 

  idFamily: string;
}

export default function Parents({familyParents, dataFamily, familyMode, enableEditing} : {familyParents : Parent[]; dataFamily : Family; familyMode: boolean; enableEditing : boolean}) {
    
  const getInitialParentData = () => {
    const initialData: Parent = {
      id: "",
      identityCard: "",
      name: "",
      lastName1: "",
      lastName2: "",
      telephone: "",
      email: "",
      occupation: "",
      idFamily: familyMode ? familyParents[0].idFamily : "", // Initialize idFamily conditionally
    };
    return initialData;
  };


  const initialParentData = getInitialParentData();
  
  const [dataParents, setDataParents] = useState<Parent[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [showMode, setShowMode] = useState(false); // Estado para controlar el modo "mostrar"
  const [loading, setLoading] = useState(false);
  const [dataParent, setDataParent] = useState<Parent>(initialParentData);
  const [familyChildrens, setFamilyChildrens] = useState<Student[]>([]);
  const [familyHeaders, setFamilyHeaders] = useState<Parent[]>([]);

  const toast = useToast();

  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const isParentSelected = (parent: Parent) =>
  selectedNames.includes(parent.name) || selectedNames.length === 0;

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // GET DATA TO LOAD ARRAY
  const fetchData = async () => {
    setLoading(true); 
    
    if (familyMode){
      setDataParents(familyParents);

      setLoading(false);
    } else {
      try {
        const parentsResponse = await fetch(`https://sayaserver.onrender.com/api/parents?page=${currentPage}&pageSize=${pageSize}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "123456",
        },
        });
        const json = await parentsResponse.json();
        console.log(json);
    
        setDataParents(json.response); // ACTUALIZAR EL ESTADO
        setTotalRecords(json.total); // Establecer el total de registros
        setTotalPages(Math.ceil(json.total / pageSize)); // Calcular y establecer el total de páginas
    
        setDataParent(initialParentData);
        
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
    setDataParent(initialParentData);
    console.log('Crear padre - Inicialiación de datos:');
    console.log(dataParent);
    setEditMode(false);
    setShowMode(false);
    onOpen();
  };

  const handleCreateData = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editMode) {
      handleUpdateDate()
      onClose()
    } else {
      const res = await fetch('https://sayaserver.onrender.com/api/parents/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "123456",
        },
        body: JSON.stringify({
          identityCard: dataParent.identityCard,
          name: dataParent.name,
          lastName1: dataParent.lastName1,
          lastName2: dataParent.lastName2,
          telephone: dataParent.telephone,
          email: dataParent.email,
          occupation: dataParent.occupation,
        })
      });
      const json = await res.json();

      setDataParent(initialParentData);

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
  }

  // EDIT DATA
  const handleEditData = async (parent: Parent) => {
    const selectedParent = dataParents.find(p => p.id === parent.id)!;
    
    setDataParent(selectedParent);
    onOpen();

    loadHeadersAndChildrens(selectedParent);
    
    setEditMode(true);
  }

  const handleUpdateDate = async () => {
    const res = await fetch(`https://sayaserver.onrender.com/api/parents/${dataParent.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "123456",
      },
      body: JSON.stringify({
        id: dataParent.id,
        identityCard: dataParent.identityCard,
        name: dataParent.name,
        lastName1: dataParent.lastName1,
        lastName2: dataParent.lastName2,
        telephone: dataParent.telephone,
        email: dataParent.email,
        occupation: dataParent.occupation,
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
    const res = await fetch(`/api/parents/${id}`, {
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
  const handleShowData = async (parent: Parent) => {
    const selectedParent = dataParents.find(p => p.id === parent.id)!;

    setDataParent(selectedParent);
    setShowMode(true); // Cambiar a modo "mostrar"
    onOpen();
    
  }

  const loadHeadersAndChildrens = async (selectedParent : Parent) => {
    setLoading(true); 

    //Petición para obtener los demás cabeceras de la familia
    try {
      const response = await fetch(`https://sayaserver.onrender.com/api/family/${selectedParent?.idFamily}/parents`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "123456",
      },
      });
      const json = await response.json();
      setFamilyHeaders(json.response);
    } catch (error) {
      console.error(error);
    }  finally {
      setLoading(false); 
    }

    //Petición para obtener los estudiantes (hijos)
    try {
      const response = await fetch(`https://sayaserver.onrender.com/api/family/${selectedParent?.idFamily}/students`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "123456",
      },
      });
      const json = await response.json();
      setFamilyChildrens(json.response);
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
            <Box display={enableEditing ? 'block' : 'none'}>
              <ButtonGroup>
                  <Button onClick={handleOpenCreateModal} size='sm' leftIcon={<AddIcon />} variant={'outline'} color={'teal'} display={familyMode ? 'block' : 'none'}>
                      Nuevo Padre
                  </Button>
              </ButtonGroup>
            </Box>
            
          </Flex>

          <Modal onClose={() => { setShowMode(false); setEditMode(false); onClose();}} size={'full'} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{editMode ? "Editar" : (showMode ? "Detalle" : "Crear") }</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box px={3} py={3}>
                    <form onSubmit={handleCreateData}>
                      <Stack spacing={4}>                     
                        <SimpleGrid columns={3} spacing={10} mb={3}>
                          <FormControl isRequired>
                              <FormLabel>Nombre</FormLabel>
                              <Input placeholder="Nombre" value={dataParent.name || ""} type='text'  onChange={(e) => setDataParent({ ...dataParent, name: e.target.value })} />
                          </FormControl>

                          <FormControl isRequired>
                              <FormLabel>Primer apellido</FormLabel>
                              <Input placeholder="Primer apellido" value={dataParent.lastName1 || ""} type='text'  onChange={(e) => setDataParent({ ...dataParent, lastName1: e.target.value })} />
                          </FormControl>

                          <FormControl>
                              <FormLabel>Segundo apellido</FormLabel>
                              <Input placeholder="Segundo apellido" value={dataParent.lastName2 || ""} type='text'  onChange={(e) => setDataParent({ ...dataParent, lastName2: e.target.value })} />
                          </FormControl>
                      </SimpleGrid>
                  
                      <SimpleGrid columns={2} spacing={10} mb={3}>
                          <FormControl isRequired>
                              <FormLabel>Cédula</FormLabel>
                              <Input placeholder="Cédula" value={dataParent.identityCard || ""} type='text' onChange={(e) => setDataParent({ ...dataParent, identityCard: e.target.value })} />
                          </FormControl>

                          <FormControl isRequired>
                              <FormLabel>Correo electrónico</FormLabel>
                              <Input placeholder="Correo electrónico" value={dataParent.email || ""} type='email'  onChange={(e) => setDataParent({ ...dataParent, email: e.target.value })} />
                          </FormControl>
                      </SimpleGrid>
                  
                      <SimpleGrid columns={2} spacing={10} mb={3}>
                          <FormControl>
                              <FormLabel>Ocupación</FormLabel>
                              <Input placeholder="Ocupación" value={dataParent.occupation || ""} type='text'  onChange={(e) => setDataParent({ ...dataParent, occupation: e.target.value })} />
                          </FormControl>

                          <FormControl>
                              <FormLabel>Número de teléfono</FormLabel>
                              <Input placeholder="Número de teléfono" value={dataParent.telephone || ""} type='tel'  onChange={(e) => setDataParent({ ...dataParent, telephone: e.target.value })} />
                          </FormControl>
                        </SimpleGrid>


                        {/*Tablas pertenecientes para las relaciones */}

                        {/* Tabla los padres */}
                        {showMode && (
                          loading ? (
                            <Box pt={4}>
                              <Card>
                                  <Box height={'10vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                      <Spinner color='teal' size='xl' thickness='3px' />
                                  </Box>
                              </Card>
                            </Box>
                          ) : (
                            <Box pt={4}>
                              <FormLabel>Cabeceras de la familia</FormLabel>
                              <Card >
                                <Table>
                                  <TableHead>
                                      <TableRow>
                                        <TableHeaderCell>ID</TableHeaderCell>
                                        <TableHeaderCell>Nombre Completo</TableHeaderCell>
                                        <TableHeaderCell>Cedula</TableHeaderCell>
                                        <TableHeaderCell>Telefono</TableHeaderCell>
                                        <TableHeaderCell>Email</TableHeaderCell>
                                        <TableHeaderCell>Ocupación</TableHeaderCell>
                                      </TableRow>
                                  </TableHead>
                                  <TableBody>
                                      {familyHeaders.map((parent: Parent) => {
                                          return (
                                            <TableRow key={parent.id}>
                                              <TableHeaderCell>{parent.id}</TableHeaderCell>
                                              <TableHeaderCell>{parent.name} {parent.lastName1} {parent.lastName2}</TableHeaderCell>
                                              <TableHeaderCell>{parent.identityCard}</TableHeaderCell>
                                              <TableHeaderCell>{parent.telephone}</TableHeaderCell>
                                              <TableHeaderCell>{parent.email}</TableHeaderCell>
                                              <TableHeaderCell>{parent.occupation}</TableHeaderCell>
                                            </TableRow>
                                          )
                                      })
                                      }
                                  </TableBody>
                                </Table>
                              </Card>
                            </Box>
                          )
                        )}


                        {/* Tabla estudiantes(hijos) */}
                        {showMode && (
                          loading ? (
                            <Box pt={4}>
                              <Card>
                                <Box height={'10vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <Spinner color='teal' size='xl' thickness='3px' />
                                </Box>
                              </Card>
                            </Box>
                          ) : (
                            <Box pt={4}>
                              <FormLabel>Hijos</FormLabel>
                              <Card>
                                <Table>
                                  <TableHead>
                                      <TableRow>
                                        <TableHeaderCell>ID</TableHeaderCell>
                                        <TableHeaderCell>Nombre Completo</TableHeaderCell>
                                        <TableHeaderCell>Telefono</TableHeaderCell>
                                        <TableHeaderCell>Dirección</TableHeaderCell>
                                        <TableHeaderCell>Fecha de nacimiento</TableHeaderCell>
                                      </TableRow>
                                  </TableHead>
                                  <TableBody>
                                      {familyChildrens.map((student: Student) => {
                                          return (
                                            <TableRow key={student.id}>
                                              <TableCell>{student.id}</TableCell>
                                              <TableCell>{student.name} {student.lastName1} {student.lastName2}</TableCell>
                                              <TableCell>{student.housePhone}</TableCell>
                                              <TableCell>{student.address}</TableCell>
                                              <TableCell>{student.dateBirth}</TableCell>
                                            </TableRow>
                                          )
                                      })
                                      }
                                  </TableBody>
                                </Table>
                              </Card>
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
                        <Heading size='md' id='Parents'>Padres</Heading>
                        <Badge color="gray">{dataParents.length}</Badge>
                      </Flex>
                      <Box>
                        <MultiSelect
                          onValueChange={setSelectedNames}
                          placeholder="Buscar..."
                          className="max-w-lg"
                        >
                          {dataParents.map((parents) => (
                            <MultiSelectItem key={parents.id} value={parents.name}>
                              {parents.name} {parents.lastName1} {parents.lastName2}
                            </MultiSelectItem>
                          ))}
                        </MultiSelect>
                      </Box>
                    </Flex>
                    <Text className="mt-2">Lista de Padres Registrados</Text>
                     
                    <Table className='mt-6'>
                        <TableHead>
                            <TableRow>
                            <TableHeaderCell>ID</TableHeaderCell>
                            <TableHeaderCell>Nombre Completo</TableHeaderCell>
                            <TableHeaderCell>Cedula</TableHeaderCell>
                            <TableHeaderCell>Telefono</TableHeaderCell>
                            <TableHeaderCell>Email</TableHeaderCell>
                            <TableHeaderCell>Ocupación</TableHeaderCell>
                            <TableHeaderCell>Acciones</TableHeaderCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataParents
                            .filter((parent) => isParentSelected(parent))
                            .map(parent => {
                                return (
                                    <TableRow key={parent.id}>
                                      <TableCell>{parent.id}</TableCell>
                                      <TableCell>{parent.name} {parent.lastName1} {parent.lastName2}</TableCell>
                                      <TableCell>{parent.identityCard}</TableCell>
                                      <TableCell>{parent.telephone}</TableCell>
                                      <TableCell>{parent.email}</TableCell>
                                      <TableCell>{parent.occupation}</TableCell>
                                      <TableCell>
                                          <ButtonGroup variant='ghost' spacing='1'>
                                              <IconButton onClick={() => handleShowData(parent)}
                                              colorScheme='blue' icon={<ViewIcon />} aria-label='Show'></IconButton>

                                              <IconButton onClick={() => handleEditData(parent)} colorScheme='green' icon={<EditIcon />} aria-label='Edit' display={enableEditing ? 'block' : 'none'}></IconButton>

                                              <IconButton onClick={() => handleDeleteData(parent.id)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete' display={(familyMode && enableEditing) ? 'block' : 'none'}></IconButton>
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
};

