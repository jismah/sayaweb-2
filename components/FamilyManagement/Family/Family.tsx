import { AddIcon, DeleteIcon, ViewIcon, EditIcon } from '@chakra-ui/icons';
import { TableContainer, Thead, Tr, Th, Tbody, Td, Box, Button, Flex, Spinner, ButtonGroup, IconButton, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useColorMode, useDisclosure, useToast, Heading, CardBody, Stack, SimpleGrid } from '@chakra-ui/react';
// import { Props } from '@supabase/auth-ui-react/dist/components/Auth/UserContext';
import React, { useState, useEffect } from 'react';
import Parents from '../../Students/Parents/Parents';
import _ from 'lodash';
import Students from '../../Students/Students/Students';
import StudentForm from '../../Inscriptions/StudentForm/StudentForm';


import { Student } from '../../Students/Students/Students';

import { Parent } from '../../Students/Parents/Parents';

import { User } from '../User/Users';
import Link from 'next/link';

import { Card, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Table, Badge, Text, MultiSelect, MultiSelectItem } from '@tremor/react';

export interface Family {
  id: string;
  name: string;
  students: Student[];
  parents: Parent[];
  user?: User | null;
}

export default function Family() {

  const initialStudentData: Student = {
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
    idFamily: "",
    idParent: "",
  };

  const initialUserData: User = {
    id: "",
    username: "",
    name: "",
    lastName1: "",
    lastName2: "",
    password: "",
    email: "",
    phone: "",
    role: "",

    idFamily: "",
  };


  const initialFamilyData: Family = {
    id: "",
    name: "",
    students: [],
    parents: [],
    user: initialUserData,
  };

  //Datos de Familia
  const [dataFamilies, setDataFamilies] = useState<Family[]>([]);
  const [dataFamily, setDataFamily] = useState<Family>(initialFamilyData);

  //const [dataUsers, setDataUsers] = useState<User[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [enableEditing, setEnableEditing] = useState(false);
  const [showMode, setShowMode] = useState(false); // Estado para controlar el modo "mostrar"
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const isFamilySelected = (family: Family) =>
  selectedFamilies.includes(family.id) || selectedFamilies.length === 0;

  // GET DATA TO LOAD ARRAY
  const fetchFamilyData = async () => {
    setLoading(true);

    try {
      const familyResponse = await fetch(`https://sayaserver.onrender.com/api/family?page=${currentPage}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "123456",
        },
      });
      const familyJson = await familyResponse.json();
      const families: Family[] = familyJson.response;

      // Validar el campo idFamily
      const validFamilies = families.filter((family: Family) => family.id);


      setTotalRecords(familyJson.total); // Establecer el total de registros
      setTotalPages(Math.ceil(familyJson.total / pageSize)); // Calcular y establecer el total de páginas

      const usersResponse = await fetch(`https://sayaserver.onrender.com/api/users`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "123456",
        },
      });

      const usersJson = await usersResponse.json();
      const users: User[] = usersJson.response;

      // Vincular usuarios a las familias por idFamilia
      const familiesWithUsers = validFamilies.map((family: Family) => {
        const usersForFamily = users.filter((user: User) => user.idFamily === family.id);
        const user = usersForFamily.length > 0 ? usersForFamily[0] : null;
        return {
          ...family,
          user: user,
        };
      });

      setDataFamilies(familiesWithUsers);
      //setDataUsers(users);
      console.log(familiesWithUsers)

    } catch (error) {
      console.error(error);
      // MANEJO DE ERRORES
    } finally {
      setLoading(false);
    }
  }


  // CREATE DATA
  const handleOpenCreateModal = () => {

    setDataFamily(initialFamilyData);
    setEditMode(false);
    setShowMode(false);
    onOpen();
  }

  const handleCreateData = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editMode) {
      handleUpdateDate()
      onClose()
    }

    setEditMode(false);
    setShowMode(false);

    fetchFamilyData();
  }

  // EDIT DATA
  const handleEditData = (family: Family) => {
    const selectedFamily = dataFamilies.find(f => f.id === family.id)!;

    setDataFamily(selectedFamily);
    onOpen();

    loadParentsAndStudents(selectedFamily);

    setEditMode(true);
    setEnableEditing(true);
  }

  useEffect(() => {
    console.log('FamiliaFuera - El id de la familia es: ');
    console.log(dataFamily.id);
  }, [dataFamily]);


  const handleUpdateDate = async () => {


    onClose();
    setEditMode(false);
    fetchFamilyData();
  }

  // DELETE DATA
  const handleDeleteData = async (id: string) => {
    const res = await fetch(`https://sayaserver.onrender.com/api/family/${id}`, {
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
    fetchFamilyData();
  }

  // SHOW DATA
  const handleShowData = async (family: Family) => {
    const selectedFamily = dataFamilies.find(f => f.id === family.id)!;

    setDataFamily(selectedFamily);
    setShowMode(true); // Cambiar a modo "mostrar"
    onOpen();

    await loadParentsAndStudents(selectedFamily);
  };

  // PAGINATION
  const pageSize = 10; // Cantidad de elementos por página
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0); // Nuevo estado para el total de registros

  const loadParentsAndStudents = async (selectedFamily: Family) => {
    const updatedParents = await loadDataByType(selectedFamily, 'parents');
    const updatedStudents = await loadDataByType(selectedFamily, 'students');
    const updatedUser = await loadDataByType(selectedFamily, 'user');
    console.log(updatedParents);

    const updatedFamily: Family = {
      ...dataFamily,
      parents: updatedParents,
      students: updatedStudents,
      user: updatedUser,
    };

    setDataFamily(updatedFamily);
  };

  const loadDataByType = async (selectedFamily: Family, type: string) => {
    setLoading(true);

    try {
      const response = await fetch(`https://sayaserver.onrender.com/api/family/${selectedFamily?.id}/${type}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "123456",
        },
      });
      const json = await response.json();

      setLoading(false);

      return json.response;
    } catch (error) {
      console.error(error);
      setLoading(false);
      return [];
    }
  };




  const handlePageChange = (newPage: number) => {
    console.log("Changing page to:", newPage);
    setCurrentPage(prevPage => newPage);
  };


  useEffect(() => {
    fetchFamilyData();
  }, [currentPage]);


  return (
    <>
      <Box px={3} py={3}>
        <Flex justifyContent={'space-between'} alignItems={'center'} mt={'40px'}>
          <ButtonGroup>
            <Link href="/Inscriptions/NewStudentForm" target="_blank">
              <Button size={'sm'} leftIcon={<AddIcon />} variant={'outline'} color={'teal'} >
                Nueva Familia
              </Button>
            </Link>
          </ButtonGroup>
        </Flex>



        <Modal onClose={() => { setShowMode(false); setEditMode(false); setEnableEditing(false); onClose(); }} size={'full'} isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{editMode ? "Editar" : (showMode ? "Detalle" : "Crear")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box px={3} py={3}>
                <form onSubmit={handleCreateData}>
                  <Stack spacing={4}>
                    {
                      !(showMode || editMode) && (
                        <StudentForm dataParents={dataFamily.parents} dataStudent={initialStudentData} editingMode={false} createStudentWithFamily={false} />
                      )
                    }

                    {(showMode || editMode) && (
                      loading ? (
                        <Box pt={4}>
                          <Card>
                              <Box height={'10vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Spinner color='teal' size='xl' thickness='3px' />
                              </Box>
                          </Card>
                        </Box>
                      ) : (
                        <Card>
                            <Heading as='h3' size='lg' id='Parents' mb={6} >Usuario familiar</Heading>

                            <SimpleGrid columns={2} spacing={10} mb={3}>
                              <FormControl>
                                <FormLabel>Titulo</FormLabel>
                                <Input value={`${dataFamily.user?.lastName1} ${dataFamily.user?.lastName2}`} variant={'filled'} color={'teal'} placeholder='Titulo' readOnly={true}></Input>
                              </FormControl>

                              <FormControl>
                                <FormLabel>Nombre de usuario</FormLabel>
                                <Input value={dataFamily.user?.username} variant={'filled'} color={'teal'} placeholder='Nombre de usuario' readOnly={true}></Input>
                              </FormControl>

                            </SimpleGrid>

                            <SimpleGrid columns={2} spacing={10}>
                              <FormControl>
                                <FormLabel>Correo electrónico</FormLabel>
                                <Input value={dataFamily.user?.email} variant={'filled'} color={'teal'} placeholder='Correo electrónico' readOnly={true}></Input>
                              </FormControl>

                              <FormControl>
                                <FormLabel>Número de teléfono</FormLabel>
                                <Input value={dataFamily.user?.phone} variant={'filled'} color={'teal'} placeholder='Número de teléfono' readOnly={true}></Input>
                              </FormControl>
                            </SimpleGrid>

                        </Card>
                      )

                    )}

                    {/*Tablas pertenecientes para las relaciones */}

                    {/* Tabla los padres */}
                    {(showMode || editMode) && (
                      loading ? (
                        <Box pt={4}>
                          <Card >
                              <Box height={'10vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Spinner color='teal' size='xl' thickness='3px' />
                              </Box>
                          </Card>
                        </Box>
                      ) : (
                        <Box pt={4}>

                          <Parents familyParents={dataFamily.parents} dataFamily={dataFamily} familyMode={true} enableEditing={enableEditing} />

                        </Box>
                      )
                    )}


                    {/* Tabla estudiantes(hijos) */}
                    {(showMode || editMode) && (
                      loading ? (
                        <Box pt={4}>
                          <Card >
                              <Box height={'10vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Spinner color='teal' size='xl' thickness='3px' />
                              </Box>
                          </Card>
                        </Box>
                      ) : (
                        <Box pt={4}>
                          
                          <Students familyStudents={dataFamily.students} dataFamily={dataFamily} familyMode={true} enableEditing={enableEditing} programMode={false} />

                        </Box>
                      )
                    )}


                    <Button type='submit' colorScheme='teal' mr={3} display={editMode ? 'block' : (showMode ? 'block' : 'none')}>
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
            <Card>
                <Box height={'80vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                  <Spinner color='teal' size='xl' thickness='3px' />
                </Box>
            </Card>
          </Box>
          : <Box pt={4}>
            <Card>
              <Flex justifyContent={'space-between'} alignItems={'center'}>
                      <Flex justifyContent="start" className="space-x-2">
                          <Heading size='md' id='familys'>Familias</Heading>
                          <Badge color="gray">{dataFamilies.length}</Badge>
                      </Flex>
                      <Box>
                          <MultiSelect
                              onValueChange={setSelectedFamilies}
                              placeholder="Buscar..."
                              className="max-w-lg"
                          >
                              {dataFamilies.map((family) => (
                              <MultiSelectItem key={family.id} value={family.id}>
                                  {family.name}
                              </MultiSelectItem>
                              ))}
                          </MultiSelect>
                      </Box>
              </Flex>
              <Text className="mt-2">Lista de Familias Registrados</Text>

              <Table className='mt-6'>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>ID</TableHeaderCell>
                    <TableHeaderCell>Titulo</TableHeaderCell>
                    <TableHeaderCell>Nombre de usuario</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataFamilies
                  .filter((family) => isFamilySelected(family))
                  .map(family => {
                    return (
                      <TableRow key={family.id}>
                        <TableCell>{family.id}</TableCell>
                        <TableCell>{family.name}</TableCell>
                        <TableCell>{family.user ? `${family.user.username}` : "N/A"} </TableCell>
                        <TableCell>
                          <ButtonGroup variant='ghost' spacing='1'>
                            <IconButton onClick={() => handleShowData(family)}
                              colorScheme='blue' icon={<ViewIcon />} aria-label='Show'></IconButton>

                            <IconButton onClick={() => handleEditData(family)} colorScheme='green' icon={<EditIcon />} aria-label='Edit'></IconButton>

                            <IconButton onClick={() => handleDeleteData(family.id)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete'></IconButton>
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


