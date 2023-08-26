import { AddIcon, DeleteIcon, CheckIcon, ViewIcon, ChevronLeftIcon, ChevronRightIcon, EditIcon } from '@chakra-ui/icons';
import { Text, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Box, Button, Flex, Center, Spinner, ButtonGroup, IconButton, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useColorMode, useDisclosure, useToast, Heading, Card, CardBody, HStack, useNumberInput, Tab, TabList, Tabs, Tooltip } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

interface NominaData {
  idNomina: string;
  idStaff: string;
  date: string;
  salary: number;
  overtimePay: number;
  sfs: number;
  afp: number;
  loans: number;
  other: number;
  total: number;
}

interface Staff {
  id: string;
  status: string;
  name: string;
  lastName1: string;
  lastName2: string;
  position: string;
}

export default function ListNomina({ idStaff, reload, setReload, reloadYear }: {
   idStaff: string, reload: boolean, setReload: (arg0: boolean) => void, reloadYear: string 
  }) {
  const router = useRouter();

  const [dataNomina, setDataNomina] = useState<Array<NominaData>>([]);
  const [displayData, setDisplayData] = useState<Array<NominaData>>([]);

  const [staff, setStaff] = useState<Staff>({
    id: "",
    status: "",
    name: "",
    lastName1: "",
    lastName2: "",
    position: "",
  });

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
  const [staffLoading, setStaffLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [staffConnected, setStaffConnected] = useState(false);

  const [found, setFound] = useState(false);

  // Year Input
  const [selectedYear, setSelectedYear] = useState(DateTime.now().toFormat('yyyy'));
  let validatedYear = DateTime.now().toFormat('yyyy');
  
  const handleYearDecrease = () => {
    if (!loading) {
      const newYear = parseInt(selectedYear) - 1;
      if (newYear >= 2000) {
        setSelectedYear(newYear.toString());
        fetchData(newYear.toString());
      }
    }
  };
  
  const handleYearIncrease = () => {
    if (!loading) {
      const newYear = parseInt(selectedYear) + 1;
      if (newYear <= 2100) {
        setSelectedYear(newYear.toString());
        fetchData(newYear.toString());
      }
    }
  };
  
  const fetchStaff = async () => {
    setStaffLoading(true);
    setStaffConnected(false);
    setFound(false);

    try {
      const staff = await fetch(`http://localhost:3000/api/staff/${idStaff}`, {
        method: 'GET',
        headers: {
          "Content-Type": 'application/json',
          "x-api-key": "123456",
        },
      });

      
      const jsonStaff = await staff.json();

      if (jsonStaff.code.toString() === '200') {
        setFound(true);
      }

      setStaff(jsonStaff.response);
      setStaffConnected(true);

    } catch (error) {
      console.error(error);
      setStaffConnected(false);
    } finally {
      setStaffLoading(false);
    }
  }; 

  // GET DATA TO LOAD ARRAY
  const fetchData = async (year: string) => {
    setLoading(true);
    setConnected(false);

    try {
      const res = await fetch(`http://localhost:3000/api/nomina/staff/${idStaff}?year=${year}`, {
        method: 'GET',
        headers: {
          "Content-Type": 'application/json',
          "x-api-key": "123456",
        },
      });
      
      const json = await res.json();

      const sortedDataNomina = [...json.response.nominas].sort((a, b) => {
        const dateA = DateTime.fromFormat(a.date, 'yyyy-MM-dd');
        const dateB = DateTime.fromFormat(b.date, 'yyyy-MM-dd');
        return dateA.toMillis() - dateB.toMillis();
      });

      setDataNomina(sortedDataNomina);
      setNominaTotals(json.response.totals);
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

  useEffect(() => {
    updateDisplayData(undefined);
  }, [currentPage]);

  useEffect(() => {
    fetchData(selectedYear);
    fetchStaff();
  }, [idStaff]);

  useEffect(() => {
    if (reload) {
      setSelectedYear(reloadYear)
      fetchData(reloadYear);
      setReload(false)
    }
  }, [reload]);
  
  return (
      <>
          <main>
            <Box position={'relative'} px={0} py={1}>
              {/* Year select */}
              <Box pb={1}>
                <Card variant={'outline'} p={2}>
                    <Center>
                    <HStack maxW='200px' textColor={'#008080'}>
                      <Button
                        textColor={'#008080'}
                        onClick={handleYearDecrease}
                        isDisabled={loading}
                      >-</Button>

                      <Input
                        type='number'
                        min={2000}
                        max={2100}
                        step={1}
                        textAlign={'center'}
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        onBlur={() => {
                          if (!/^\d+$/.test(selectedYear)) {
                            setSelectedYear(validatedYear);
                          } else {
                            validatedYear = (Math.min(Math.max(parseInt(selectedYear), 2000), 2100)).toString();
                            setSelectedYear(validatedYear);
                            fetchData(validatedYear);
                          }
                        }}
                        isDisabled={loading}
                      />

                      <Button
                        textColor={'#008080'}
                        onClick={handleYearIncrease}
                        isDisabled={loading}
                      >+</Button>
                    </HStack>
                    </Center>
                </Card>
              </Box>
              <Box position={'relative'}>   
                <Box position={'absolute'} right={1} top={'-120px'} minH={'59.33px'} minW={'355px'}
                  display={'flex'} gap={4} alignItems={'center'}
                  px={12} py={2}
                  bg={'rgba(247, 250, 252, 0.7)'} borderRadius={'8px 8px 0 0'} border={'1px solid #edf2f7'}>
                    {!staffLoading && staffConnected && found && (
                    <Box pr={'10px'}>
                      <Text fontSize={'14px'} fontWeight={700} color={'#4A5568'}>
                          {staff.name} {staff.lastName1} {staff.lastName2}
                        </Text>
                        <Text fontSize={'14px'} fontWeight={400} color={'#4A5568'}>
                          {staff.position}
                        </Text>
                    </Box> )}
                    {!staffLoading && staffConnected && found && (
                    <Box pl={0}>
                      <Text fontSize={'14px'} fontWeight={400} color={'#4A5568'}>
                          ID: {staff.id}
                        </Text>
                        <Text fontSize={'14px'} fontWeight={700} color={staff.status ? '#4A5568' : '#AA0000'}>
                          {staff.status ? "Activo" : "No activo"}
                        </Text>  
                    </Box> )}
                    {!staffLoading && !staffConnected && (
                      <Box color={'#C44D4D'}>Hubo un error al buscar los datos del empleado</Box>
                    )}
                    {!staffLoading && staffConnected && !found && (
                      <Box color={'#C44D4D'}>Empleado con ID #{idStaff} no encontrado</Box>
                    )}
                </Box>
              {loading ?
                      <Box>
                          <Card variant={'outline'}>
                              <CardBody>
                                  <Box height={'65vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                      <Spinner color='teal' size='xl' thickness='3px' />
                                  </Box>
                              </CardBody>
                          </Card>
                      </Box>
                      : !connected ?
                        <Box><Card variant={'outline'} px={0} py={200}>
                          <Text textAlign={'center'} textColor={'#C44D4D'}>No se logro conectar con el servidor</Text>
                        </Card></Box>

                      : dataNomina.length <= 0 ? 
                        <Box><Card variant={'outline'} px={0} py={200}>
                          <Text textAlign={'center'}>No se encontraron records para mostrar</Text>
                        </Card></Box>

                      : <Box position={'relative'}>
                          <Box h={'65vh'}>
                          <Card variant={'outline'}>
                              <CardBody p={0}>
                                  <TableContainer>
                                      <Table variant='striped'>
                                          <Thead>
                                              <Tr>
                                                  <Th>ID Nomina</Th>
                                                  <Th>Fecha</Th>
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
                                              {displayData.map(({ idNomina, date, salary, overtimePay, sfs, afp, loans, other, total }) => {
                                                  return (
                                                      <Tr key={idNomina}>
                                                            <Td>{idNomina}</Td>
                                                            <Td>{DateTime.fromISO(date)
                                                                .setLocale('es')
                                                                .toFormat('MMMM dd, yyyy')
                                                                .replace(/^\w/, firstChar => firstChar.toUpperCase())}</Td>
                                                            <Td>{salary.toLocaleString()}</Td>
                                                            <Td>{overtimePay.toLocaleString()}</Td>
                                                            <Td>{sfs.toLocaleString()}</Td>
                                                            <Td>{afp.toLocaleString()}</Td>
                                                            <Td>{loans.toLocaleString()}</Td>
                                                            <Td>{other.toLocaleString()}</Td>
                                                            <Td>{total.toLocaleString()}</Td>
                                                          <Td>
                                                              <ButtonGroup variant='ghost' spacing='1'>
                                                                <Tooltip label="Editar">
                                                                  <IconButton colorScheme='blue' icon={<EditIcon />} aria-label='Show'>
                                                                  </IconButton>
                                                                </Tooltip>

                                                                <Tooltip label='Ir a nomina'>
                                                                  <IconButton colorScheme='blue' icon={<ViewIcon />} aria-label='Show'
                                                                  onClick={() => {
                                                                    router.push(`/App/Nomina?id=${idNomina}`);}}>
                                                                  </IconButton>
                                                                </Tooltip>
                                                              </ButtonGroup>
                                                          </Td>
                                                      </Tr>
                                                  )
                                              })
                                              }
                                          </Tbody>
                                          <Tfoot>
                                            <Tr>
                                              <Th colSpan={2}>Totales del año</Th>
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
            </Box>
              
          </main>
      </>
  )
};

