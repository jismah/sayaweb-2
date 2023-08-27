import { AddIcon, ChevronLeftIcon, ChevronRightIcon, EditIcon } from '@chakra-ui/icons';
import { Text, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Tfoot, Box, Button, Spinner, ButtonGroup, IconButton, useColorMode, useDisclosure, useToast, Card, CardBody, HStack, Tooltip } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import React, { useState, useEffect, Fragment } from 'react';
import { MdPersonSearch } from "react-icons/md";
import { HiDocument } from "react-icons/hi2";

interface ResponseData {
  salary: number;
  extraDays: number;
  overtimePay: number;
  sfs: number;
  afp: number;
  loans: number;
  other: number;
  total: number;
  staff: {
    id: number;
    name: string;
    lastName1: string;
    lastName2: string;
    position: string;
    status: boolean;
  };
}

interface DetailData {
  idNomina: number,
  idStaff: number,
  date: string,
  salary: number,
  extraDays: number,
  overtimePay: number,
  sfs: number,
  afp: number,
  loans: number,
  other: number,
  total: number,
}

export default function ListNomina({ idNomina, reload, setters }: {
   idNomina: string, reload: boolean, 
   setters: { 
    setReload: (arg0: boolean) => void, 
    remote: ({status, id}: {status: boolean, id: string}) => void,
    setEditMode: (arg0: boolean) => void,
    setEditData: ({idNomina, date}: {idNomina: string, date: string}) => void,
    setDetailEditMode: (arg0: boolean) => void,
    setDetailEditData: (arg0: DetailData) => void,
    remoteDoc: (arg0: string) => void,
  }
  }) {

  const [dataNomina, setDataNomina] = useState<Array<ResponseData>>([]);
  const [displayData, setDisplayData] = useState<Array<ResponseData>>([]);
  const [date, setDate] = useState<string>("");
  const [nominaTotals, setNominaTotals] = useState({
    salary: 0,
    overtimePay: 0,
    sfs: 0,
    afp: 0,
    loans: 0,
    other: 0,
    total: 0,
  });

  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState(false);
  const [connected, setConnected] = useState(false);

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // GET DATA TO LOAD ARRAY
  const fetchData = async () => {
    setLoading(true);
    setConnected(false);
    setFound(false)

    try {
      const res = await fetch(`http://localhost:3000/api/detailNomina/${idNomina}`, {
        method: 'GET',
        headers: {
          "Content-Type": 'application/json',
          "x-api-key": "123456",
        },
      });

      const json = await res.json();
      console.log(json);

      const sortedDataNomina = [...json.response.nominas].sort((a, b) => {
        const nameA = a.staff.name.toLowerCase();
        const nameB = b.staff.name.toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });      

      if (json.code.toString() === '200') {
        setFound(true)
      }

      setDataNomina(sortedDataNomina);
      setNominaTotals(json.response.totals);
      setDate(json.response.date);

      setCurrentPage(1);
      updateDisplayData(sortedDataNomina);
      setTotalPages(Math.ceil(json.total/pageSize));

      setConnected(true);

    } catch (error) {
      console.error(error);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 7;

  function updateDisplayData(data: any[] | undefined) {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    if (data) {
      setDisplayData(data.slice(startIndex, endIndex));
    } else {
      setDisplayData(dataNomina.slice(startIndex, endIndex));
    }
  }

  const handleEdit = () => {
    if (dataNomina.length == 0) {
      setters.setEditData({ idNomina: idNomina, date: date });
      setters.setEditMode(true);
    } 
  }

  useEffect(() => {
    updateDisplayData(undefined);
  }, [currentPage]);
  
  useEffect(() => {
    fetchData();
  }, [idNomina]);

  useEffect(() => {
    if (reload) {
      fetchData();
      setters.setReload(false)
    }
  }, [reload]);
  
  return (
      <>
          <main>
            <Box position={'relative'} px={0} py={1}>
              <Box position={'absolute'} right={1} top={'-45px'} display={'flex'} gap={'20px'}>

                  {/* Nomina General Info */}
                  <Box display={'flex'} gap={4} alignItems={'center'} justifyContent={'center'} pr={12} pl={2} py={4} 
                    minW={'340.44px'} h={'49.33px'}
                    bg={'rgba(247, 250, 252, 0.7)'} borderRadius={'8px 8px 0 0'} border={'1px solid #edf2f7'}>

                    {!loading && connected && found && (<Box>
                      <Tooltip label='Documento ACH'>
                          <IconButton variant={'outline'} color={'#5bc0bb'} bg={'transparent'} border={'none'} icon={<HiDocument />} aria-label='Bank Transfer Document'
                          onClick={() => {
                            setters.remoteDoc(idNomina)
                          }}>
                          </IconButton>
                      </Tooltip>
                      <Tooltip label={dataNomina.length > 0 ? 'Solo puede editar nóminas vacías' : 'Editar Nómina'}>
                        <IconButton isDisabled={dataNomina.length > 0} variant={'outline'} color={'#5bc0bb'} bg={'transparent'} border={'none'} icon={<EditIcon />} aria-label="Editar" 
                        onClick={handleEdit}/>
                      </Tooltip>
                    </Box>)}

                    {!loading && connected && found && (
                      <Text pr={2} fontSize={'18px'} fontWeight={700} color={'#38B2AC'}>Nomina #{idNomina}</Text>
                    )}

                    {!loading && connected && found && (
                    <Text textColor={'#4a5568'} fontWeight={500}>
                      {DateTime.fromISO(date)
                          .setLocale('es')
                          .toFormat('MMMM dd, yyyy')
                          .replace(/^\w/, firstChar => firstChar.toUpperCase())}
                    </Text>
                    )}

                    {!loading && connected && !found && (
                      <Text textAlign={'center'} fontWeight={600} color={'#C44D4D'}>Nomina #{idNomina} no encontrada</Text>
                    )}
                  </Box>

                </Box> 
              {loading ?
                      <Box>
                          <Card variant={'outline'}>
                              <CardBody>
                                  <Box height={'69vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                      <Spinner color='teal' size='xl' thickness='3px' />
                                  </Box>
                              </CardBody>
                          </Card>
                      </Box>
                      : !connected ?
                        <Box><Card variant={'outline'} px={0} py={200}>
                          <Text textAlign={'center'} textColor={'#C44D4D'}>No se logro conectar con el servidor</Text>
                        </Card></Box>
                      
                      : !found ?
                        <Box><Card variant={'outline'} px={0} py={200}>
                          <Text textAlign={'center'} textColor={'#C44D4D'}>No se pudo encontro la nomina #{idNomina}</Text>
                        </Card></Box>

                      : dataNomina.length <= 0 && found ? 
                        <Box><Card variant={'outline'} px={0} py={200} display={'flex'} flexDirection={'column'} gap={4} alignItems={'center'}>
                          <Text textAlign={'center'}>No se encontraron records para mostrar</Text>
                          <Button maxW={'300px'} variant={'outline'} fontWeight={400} textColor={'#008080'} 
                          leftIcon={<AddIcon boxSize={3} />}
                          onClick={() => {setters.remote({status: true, id: idNomina})}}
                          >Nuevo detalle de nomina</Button>
                        </Card></Box>

                      : <Box>
                          <Box h={'72vh'}>
                          <Card variant={'outline'}>
                              <CardBody p={0}>
                                  <TableContainer>
                                      <Table variant='striped'>
                                          <Thead>
                                              <Tr>
                                                  <Th colSpan={2}>Datos Empleado</Th>
                                                  <Th>Salario</Th>
                                                  <Th>Días Extra</Th>
                                                  <Th>SFS</Th>
                                                  <Th>AFP</Th>
                                                  <Th>Prestamos</Th>
                                                  <Th>Otros</Th>
                                                  <Th>Total</Th>
                                                  <Th>Acciones</Th>
                                              </Tr>
                                          </Thead>
                                          <Tbody>
                                              {displayData.map(({ salary, extraDays, overtimePay, sfs, afp, loans, other, total, staff}) => {
                                                  return (
                                                  <Fragment key={staff.id}>
                                                    <Tr>
                                                      <Td pr={'20px'}>
                                                        <Text fontSize={'14px'} fontWeight={700} color={'#4A5568'}>
                                                            {staff.name} {staff.lastName1} {staff.lastName2}
                                                          </Text>
                                                          <Text fontSize={'14px'} fontWeight={400} color={'#4A5568'}>
                                                            {staff.position}
                                                          </Text>
                                                      </Td>
                                                      <Td pl={0}>
                                                        <Text fontSize={'14px'} fontWeight={400} color={'#4A5568'}>
                                                            ID: {staff.id}
                                                          </Text>
                                                          <Text fontSize={'14px'} fontWeight={700} color={staff.status ? '#4A5568' : '#AA0000'}>
                                                            {staff.status ? "Activo" : "No activo"}
                                                          </Text>  
                                                      </Td>
                                                      <Td>{salary.toLocaleString()}</Td>
                                                      <Td>{overtimePay.toLocaleString()}</Td>
                                                      <Td>{sfs.toLocaleString()}</Td>
                                                      <Td>{afp.toLocaleString()}</Td>
                                                      <Td>{loans.toLocaleString()}</Td>
                                                      <Td>{other.toLocaleString()}</Td>
                                                      <Td>{total.toLocaleString()}</Td>
                                                      <Td>
                                                        <ButtonGroup variant="ghost" spacing="1">
                                                          <Tooltip label='Editar'>
                                                            <IconButton colorScheme="blue" icon={<EditIcon />} aria-label="Editar"
                                                            onClick={() => {
                                                              setters.setDetailEditData({
                                                                idNomina: Number(idNomina),
                                                                idStaff: staff.id,
                                                                date: "",
                                                                salary: salary,
                                                                extraDays: extraDays,
                                                                overtimePay: overtimePay,
                                                                sfs: sfs,
                                                                afp: afp,
                                                                loans: loans,
                                                                other: other,
                                                                total: total,
                                                              });

                                                              setters.setDetailEditMode(true);
                                                            }} />
                                                          </Tooltip>
                                                          <Tooltip label='Ver empleado'>
                                                            <IconButton colorScheme="blue" icon={<MdPersonSearch />}aria-label="Ver empleado" />
                                                          </Tooltip>
                                                        </ButtonGroup>
                                                      </Td>
                                                    </Tr>
                                                  </Fragment>
                                                  )
                                              })
                                              }
                                          </Tbody>
                                          <Tfoot>
                                            <Tr>
                                              <Th colSpan={2}>Totales de la nomina</Th>
                                              <Th>{nominaTotals.salary.toLocaleString()}</Th>
                                              <Th>{nominaTotals.overtimePay.toLocaleString()}</Th>
                                              <Th>{nominaTotals.sfs ? nominaTotals.sfs.toLocaleString() : '0'}</Th>
                                              <Th>{nominaTotals.afp.toLocaleString()}</Th>
                                              <Th>{nominaTotals.loans.toLocaleString()}</Th>
                                              <Th>{nominaTotals.other.toLocaleString()}</Th>
                                              <Th>{nominaTotals.total.toLocaleString()}</Th>
                                              <Th></Th>
                                            </Tr>
                                          </Tfoot>
                                      </Table>
                                  </TableContainer>
                              </CardBody>
                          </Card>
                          </Box> 
                          
                          {/* Pagination */}
                          <Box display={'flex'} justifyContent={'center'} px={2} pt={2} pb={0}>
                            <HStack maxW={'200px'} gap={3} textColor={'#008080'}>
                              <IconButton
                                textColor={'#008080'}
                                bg={'transparent'}
                                icon={<ChevronLeftIcon h={5} w={5} />}
                                aria-label={'Página anterior'}
                                onClick={() => {
                                if (currentPage > 1) {
                                setCurrentPage(currentPage - 1);
                                }
                                }}
                                isDisabled={loading || currentPage === 1}
                              />

                              <Text>
                                {currentPage} / {totalPages}
                              </Text>

                              <IconButton
                                textColor={'#008080'}
                                bg={'transparent'}
                                icon={<ChevronRightIcon h={5} w={5} />}
                                aria-label={'Página siguiente'}
                                onClick={() => {
                                if (currentPage < totalPages) {
                                setCurrentPage(currentPage + 1);
                                }
                                }}
                                isDisabled={loading || currentPage === totalPages}
                              />
                            </HStack>
                          </Box>
                      </Box>
                  }
            </Box>
              
          </main>
      </>
  )
};

