import { AddIcon, DeleteIcon, ViewIcon, EditIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Spinner, ButtonGroup, IconButton, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast, Heading, Stack } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Parent } from '../Parents/Parents';
import { Family } from '../../FamilyManagement/Family/Family';
import StudentForm from '../../Inscriptions/StudentForm/StudentForm';
import router from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { Card, TableBody, TableCell, TableHead, TableHeaderCell, TableRow, Table, Color, Badge, Title, Text, MultiSelect, MultiSelectItem } from '@tremor/react';
import { DateTime } from 'luxon';


export interface Student {
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

const colors: { [key: string]: Color } = {
  "Rechazado": "red",
  "Inscripto": "teal",
  "En Lista de Espera": "gray",
  "Solicitud Recibida": "amber",
  "Aceptado Sin Inscribir": "sky",
};

export default function Students({ familyStudents, dataFamily, familyMode, programMode, enableEditing }: { familyStudents: Student[]; dataFamily: Family; familyMode: boolean; enableEditing: boolean; programMode: boolean }) {


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
  const user = useUser();

  const [dataStudents, setDataStudents] = useState<Student[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [showMode, setShowMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataStudent, setDataStudent] = useState<Student>(initialStudentData);

  const [familySiblings, setFamilySiblings] = useState<Student[]>([]);
  const [familyHeaders, setFamilyHeaders] = useState<Parent[]>([]);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const isStudentSelected = (student: Student) =>
    selectedNames.includes(student.name) || selectedNames.length === 0;


  // GET DATA TO LOAD ARRAY
  const fetchData = async () => {
    setLoading(true);

    if (familyMode || programMode) {
      setDataStudents(familyStudents);
      setLoading(false);
    } else {
      try {
        const studentsResponse = await fetch(`https://sayaserver.onrender.com/api/students?page=${currentPage}&pageSize=${pageSize}`, {
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

  const handleOpenCreateModal = () => {
    setDataStudent(initialStudentData);
    console.log('Crear student - Inicialiación de datos:');
    console.log(dataStudent);
    setEditMode(false);
    setShowMode(false);
    if (familyMode) {
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
      const res = await fetch('https://sayaserver.onrender.com/api/students/', {
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

  const handleEditData = async (student: Student) => {
    const selectedStudent = dataStudents.find(s => s.id === student.id)!;

    setDataStudent(selectedStudent);
    onOpen();

    loadParentsAndSiblings(selectedStudent);

    setEditMode(true);
  }

  const handleUpdateDate = async () => {
    const res = await fetch(`https://sayaserver.onrender.com/api/students/${dataStudent.id}`, {
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

  const handleShowData = async (student: Student) => {
    const selectedStudent = dataStudents.find(s => s.id === student.id)!;

    setDataStudent(selectedStudent);
    setShowMode(true); // Cambiar a modo "mostrar"
    onOpen();

    loadParentsAndSiblings(selectedStudent);

  }

  const loadParentsAndSiblings = async (selectedStudent: Student) => {
    setLoading(true);

    try {
      const response = await fetch(`https://sayaserver.onrender.com/api/family/${selectedStudent?.idFamily}/parents`, {
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
    } finally {
      setLoading(false);
    }

    //Petición para obtener los estudiantes (hermanos)
    try {
      const response = await fetch(`https://sayaserver.onrender.com/api/family/${selectedStudent?.idFamily}/students`, {
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
    } finally {
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
    if (user) {
      fetchData();
    } else {
      router.push('/Auth/Login');
    }
  }, [currentPage]);

  return (
    <>
      <Box px={3} py={3}>
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Box></Box>
          <Box display={enableEditing ? 'block' : 'none'}>
            <ButtonGroup>
              <Button onClick={handleOpenCreateModal} size='sm' leftIcon={<AddIcon />} variant={'outline'} color={'teal'} display={familyMode ? 'block' : 'none'}>
                Nuevo Estudiante
              </Button>
            </ButtonGroup>
          </Box>
        </Flex>

        <Modal onClose={() => { setShowMode(false); onClose(); }} size={'full'} isOpen={isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{editMode ? "Editar" : (showMode ? "Detalle" : "Crear")}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box px={3} py={3}>
                <form onSubmit={handleCreateData}>
                  <Stack spacing={4}>

                    {!showMode && (
                      <StudentForm dataParents={dataFamily.parents} dataStudent={dataStudent} editingMode={(editMode ? true : false)} createStudentWithFamily={true} />
                    )}


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
                          <Card>

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
                                      <TableCell>{parent.id}</TableCell>
                                      <TableCell>{parent.name} {parent.lastName1} {parent.lastName2}</TableCell>
                                      <TableCell>{parent.identityCard}</TableCell>
                                      <TableCell>{parent.telephone}</TableCell>
                                      <TableCell>{parent.email}</TableCell>
                                      <TableCell>{parent.occupation}</TableCell>
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


                    {/* Tabla estudiantes(hermanos) */}
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
                          <FormLabel>Hermanos</FormLabel>
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
                                {familySiblings.map((student: Student) => {
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
                  <Heading size='md' id='Parents'>Estudiantes</Heading>
                  <Badge color="gray">{dataStudents.length}</Badge>
                </Flex>
                <Box>
                  <MultiSelect
                    onValueChange={setSelectedNames}
                    placeholder="Buscar..."
                    className="max-w-lg"
                  >
                    {dataStudents.map((student) => (
                      <MultiSelectItem key={student.id} value={student.name}>
                        {student.name} {student.lastName1} {student.lastName2}
                      </MultiSelectItem>
                    ))}
                  </MultiSelect>
                </Box>
              </Flex>
              <Text className="mt-2">Lista de Niños Registrados</Text>

              <Table className='mt-6'>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>ID</TableHeaderCell>
                    <TableHeaderCell>Nombre Completo</TableHeaderCell>
                    <TableHeaderCell>Telefono</TableHeaderCell>
                    <TableHeaderCell>Dirección</TableHeaderCell>
                    <TableHeaderCell>Estado</TableHeaderCell>
                    <TableHeaderCell>Fecha Nacimiento</TableHeaderCell>
                    <TableHeaderCell>Condición médica</TableHeaderCell>
                    <TableHeaderCell>Progreso deseado</TableHeaderCell>
                    <TableHeaderCell>Permiso para fotos</TableHeaderCell>
                    <TableHeaderCell>Acciones</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataStudents
                    .filter((student) => isStudentSelected(student))
                    .map(student => {
                      let StatusAux = "";

                      if (student.status === "REJECTED") {
                        StatusAux = "Rechazado";
                      } else if (student.status === "ENROLLED") {
                        StatusAux = "Inscrito";
                      } else if (student.status === "WAITLISTED") {
                        StatusAux = "En Lista de Espera";
                      } else if (student.status === "ACCEPTED_NOT_ENROLLED") {
                        StatusAux = "Aceptado Sin Inscribir"
                      } else if (student.status === "PENDING_CHECK") {
                        StatusAux = "Solicitud Recibida"
                      }

                      return (
                        <TableRow key={student.id}>
                          <TableCell>#{student.id}</TableCell>
                          <TableCell><b>{student.name} {student.lastName1} {student.lastName2}</b></TableCell>
                          <TableCell>{student.housePhone}</TableCell>
                          <TableCell>{student.address}</TableCell>
                          <TableCell>
                            <Badge color={colors[StatusAux]} size="xs">
                              {StatusAux}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {DateTime.fromISO(student.dateBirth)
                                .setLocale('es')
                                .toFormat('MMMM dd, yyyy')
                                .replace(/^\w/, firstChar => firstChar.toUpperCase())}
                            </TableCell>
                          <TableCell>{student.medicalCondition}</TableCell>
                          <TableCell>{student.progressDesired}</TableCell>
                          <TableCell>{student.allowedPictures ? "Permitido" : "No permitido"}</TableCell>
                          <TableCell>
                            <ButtonGroup variant='ghost' spacing='1'>
                              <IconButton onClick={() => handleShowData(student)}
                                colorScheme='blue' icon={<ViewIcon />} aria-label='Show'></IconButton>

                              <IconButton onClick={() => handleEditData(student)} colorScheme='green' icon={<EditIcon />} aria-label='Edit' display={enableEditing ? 'block' : 'none'}></IconButton>

                              <IconButton onClick={() => handleDeleteData(student.id)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete' display={(familyMode && enableEditing) ? 'block' : 'none'}></IconButton>
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
            size={"sm"}
            colorScheme={currentPage === 1 ? 'teal' : 'gray'}
          >
            {'<<'}
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            size={"sm"}
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
                size={"sm"}
                colorScheme={currentPage === index + 1 ? 'teal' : 'gray'}
              >
                {index + 1}
              </Button>
            ))
            : currentPage <= 5
              ? Array.from({ length: 10 }, (_, index) => (
                <Button
                  key={index + 1}
                  size={"sm"}
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
                    size={"sm"}
                    onClick={() => handlePageChange(totalPages - 9 + index)}
                    colorScheme={currentPage === totalPages - 9 + index ? 'teal' : 'gray'}
                  >
                    {totalPages - 9 + index}
                  </Button>
                ))
                : Array.from({ length: 10 }, (_, index) => (
                  <Button
                    key={currentPage - 5 + index}
                    size={"sm"}
                    onClick={() => handlePageChange(currentPage - 5 + index)}
                    colorScheme={currentPage === currentPage - 5 + index ? 'teal' : 'gray'}
                  >
                    {currentPage - 5 + index}
                  </Button>
                ))}


          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            size={"sm"}
            colorScheme={currentPage === totalPages ? 'gray' : 'teal'}
            isDisabled={currentPage === totalPages}
          >
            {'>'}
          </Button>


          <Button
            onClick={() => handlePageChange(totalPages)}
            size={"sm"}
            colorScheme={currentPage === totalPages ? 'teal' : 'gray'}
          >
            {'>>'}
          </Button>
        </ButtonGroup>
      </Box>



    </>
  )
};

