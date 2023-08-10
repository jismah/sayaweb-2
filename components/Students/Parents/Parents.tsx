import { AddIcon, DeleteIcon, CheckIcon, ViewIcon, EditIcon} from '@chakra-ui/icons';
import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Box, Button, Flex, Center, Spinner, ButtonGroup, IconButton, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useColorMode, useDisclosure, useToast, Heading, Card, CardBody, Stack } from '@chakra-ui/react';
// import { Props } from '@supabase/auth-ui-react/dist/components/Auth/UserContext';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';


export default function Parents() {
    
  const [dataParents, setDataParents] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataParent, setDataParent] = useState({
    id: "",
    identityCard: "",
    name: "",
    lastName1: "",
    lastName2: "",
    telephone: "",
    email: "",
    occupation: "",
  });
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // GET DATA TO LOAD ARRAY
  const fetchData = async () => {
  setLoading(true); 

  try {
    const res = await fetch(`http://localhost:3000/api/parents?page=${currentPage}&pageSize=${pageSize}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "123456",
    },
    });
    const json = await res.json();
    console.log(json);
    setDataParents(json.response); // ACTUALIZAR EL ESTADO
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
  const handleCreateData = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editMode) {
      handleUpdateDate()
      onClose()
    } else {
      const res = await fetch('/api/parent/', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
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

      setDataParent({
        id: "",
        identityCard: "",
        name: "",
        lastName1: "",
        lastName2: "",
        telephone: "",
        email: "",
        occupation: ""
      })

      toast({
        title: 'Registro Creado!',
        description: "Se creo el registro correctamente.",
        status: 'success',
        position: 'bottom-right',
        duration: 4000,
        isClosable: true,
      })
    }
    setEditMode(false)
    fetchData();
  }

  // EDIT DATA
  const handleEditData = async (id: string, name: string, lastName1: string, lastName2: string, identityCard: string, telephone: string, email: string, occupation: string) => {
    setDataParent({ id, name, lastName1, lastName2, identityCard, telephone, email, occupation })
    onOpen()
    console.log(id, name, lastName1, lastName2, identityCard, telephone, email, occupation)
    setEditMode(true);
  }

  const handleUpdateDate = async () => {
    const res = await fetch('/api/parent/:id', {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
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
    console.log(json)
    onClose()
    setEditMode(false)
    fetchData()
  }

  // DELETE DATA
  const handleDeleteData = async (id: string) => {
    const res = await fetch('/api/parent/:id', {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
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

  // VIEW DETAIL DATA
  // const handleShowData = async (id: string) => {

  // }

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
            <Heading as='h3' size='xl' id='Parents' >Padres</Heading>
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
                <Button onClick={onOpen} size='sm' leftIcon={<AddIcon />} variant={'outline'} color={'teal'}>
                    Nuevo Padre
                </Button>
            </ButtonGroup>
          </Flex>

          <Modal onClose={onClose} size={'full'} isOpen={isOpen}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Crear programa</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box px={3} py={3}>
                        <form onSubmit={handleCreateData}>
                          <Stack spacing={4}>                       
                              <FormControl isRequired>
                                  <FormLabel>Nombre</FormLabel>
                                  <Input value={dataParent.name || ""} type='text' onChange={(e) => setDataParent({ ...dataParent, name: e.target.value })} />
                              </FormControl>

                              <FormControl isRequired>
                                  <FormLabel>Primer apellido</FormLabel>
                                  <Input value={dataParent.lastName1 || ""} type='text' onChange={(e) => setDataParent({ ...dataParent, lastName1: e.target.value })} />
                              </FormControl>

                              <FormControl>
                                  <FormLabel>Segundo apellido</FormLabel>
                                  <Input value={dataParent.lastName2 || ""} type='text' onChange={(e) => setDataParent({ ...dataParent, lastName2: e.target.value })} />
                              </FormControl>

                              <FormControl isRequired>
                                  <FormLabel>Cédula</FormLabel>
                                  <Input value={dataParent.identityCard || ""} type='text' onChange={(e) => setDataParent({ ...dataParent, identityCard: e.target.value })} />
                              </FormControl>

                              <FormControl isRequired>
                                  <FormLabel>Correo eléctronico</FormLabel>
                                  <Input value={dataParent.email || ""} type='email' onChange={(e) => setDataParent({ ...dataParent, email: e.target.value })} />
                              </FormControl>

                              <FormControl>
                                  <FormLabel>Ocupación</FormLabel>
                                  <Input value={dataParent.occupation || ""} type='text' onChange={(e) => setDataParent({ ...dataParent, occupation: e.target.value })} />
                              </FormControl>

                              <FormControl>
                                  <FormLabel>Número de telefono</FormLabel>
                                  <Input value={dataParent.telephone || ""} type='text' onChange={(e) => setDataParent({ ...dataParent, telephone: e.target.value })} />
                              </FormControl>

                              <Button type='submit' colorScheme='teal' mr={3}>
                                        Agregar
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
                                              <Th>Cedula</Th>
                                              <Th>Nombre Completo</Th>
                                              <Th>Telefono</Th>
                                              <Th>Email</Th>
                                              <Th>Ocupación</Th>
                                              <Th>Acciones</Th>
                                              </Tr>
                                          </Thead>
                                          <Tbody>
                                              {dataParents.map(({ id, name, lastName1, lastName2, identityCard, telephone, email, occupation }) => {
                                                  return (
                                                      <Tr key={id}>
                                                        <Td>{id}</Td>
                                                        <Td>{name} {lastName1} {lastName2}</Td>
                                                        <Td>{identityCard}</Td>
                                                        <Td>{telephone}</Td>
                                                        <Td>{email}</Td>
                                                        <Td>{occupation}</Td>
                                                          <Td>
                                                              <ButtonGroup variant='ghost' spacing='1'>
                                                                  <IconButton onClick={() => handleDeleteData(id)}
                                                                  colorScheme='blue' icon={<ViewIcon />} aria-label='Show'></IconButton>

                                                                  <IconButton onClick={() => handleEditData(id, name, lastName1, lastName2, identityCard, telephone, email, occupation)} colorScheme='green' icon={<EditIcon />} aria-label='Edit'></IconButton>

                                                                  <IconButton onClick={() => handleDeleteData(id)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete'></IconButton>
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
                {Array.from({ length: Math.min(totalPages, 10) }, (_, index) => (
                    <Button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    colorScheme={currentPage === index + 1 ? 'teal' : 'gray'}
                    >
                    {index + 1}
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

