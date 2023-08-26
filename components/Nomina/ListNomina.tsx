import { AddIcon, DeleteIcon, CheckIcon, ViewIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Text, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Box, Button, Flex, Center, Spinner, ButtonGroup, IconButton, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useColorMode, useDisclosure, useToast, Heading, Card, CardBody, HStack, useNumberInput, Tab, TabList, Tabs, Tooltip } from '@chakra-ui/react';
import { DateTime } from 'luxon';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

interface NominaData {
  id: string;
  date: string;
  type: string;
  totals: {
    salary: number | null;
    overtimePay: number | null;
    sfs: number | null;
    afp: number | null;
    loans: number | null;
    other: number | null;
    total: number | null;
  };
}

interface MonthlyData {
  month: string;
  totals: {
    salary: number | null;
    overtimePay: number | null;
    sfs: number | null;
    afp: number | null;
    loans: number | null;
    other: number | null;
    total: number | null;
  };
}

export default function ListNomina({ setSearchId }: { setSearchId: (arg0: string) => void }) {
  const router = useRouter();

  const [dataNomina, setDataNomina] = useState<Array<NominaData>>([]);
  const [displayData, setDisplayData] = useState<Array<NominaData>>([]);
  
  const [dataMonthly, setDataMonthly] = useState<Array<MonthlyData>>([]);
  const [displayMonthly, setDisplayMonthly] = useState<Array<MonthlyData>>([]);  

  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  // GET DATA TO LOAD ARRAY
  const fetchData = async (year: string) => {
    setLoading(true);
    setConnected(false);

    try {
      const res = await fetch(`http://localhost:3000/api/nomina/quincenal?year=${year}`, {
        method: 'GET',
        headers: {
          "Content-Type": 'application/json',
          "x-api-key": "123456",
        },
      });

      const json = await res.json();
      console.log(json);

      const sortedDataNomina = [...json.response].sort((a, b) => {
        const dateA = DateTime.fromFormat(a.date, 'yyyy-MM-dd');
        const dateB = DateTime.fromFormat(b.date, 'yyyy-MM-dd');
        return dateA.toMillis() - dateB.toMillis();
      });

      setDataNomina(sortedDataNomina);

      const monthly = tranformToMonthly(sortedDataNomina);
      setDataMonthly(monthly)
      setCurrentPage(1);

      updateDisplayData(json.response, monthly);

      if (selectedTab == 0) {
        setTotalPages(Math.ceil(json.total/pageSizeQuincenal));
      } else {
        setTotalPages(Math.ceil(monthly.length/pageSizeMonthly));
      }

      setConnected(true);

    } catch (error) {
      console.error(error);
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }

  // Totals
  const [columnTotals, setColumnTotals] = useState({
    salary: 0,
    overtimePay: 0,
    sfs: 0,
    afp: 0,
    loans: 0,
    other: 0,
    total: 0,
  });

  function calculateTotals(dataNomina: { totals: any; }[]) {
    const columnTotals = {
      salary: 0,
      overtimePay: 0,
      sfs: 0,
      afp: 0,
      loans: 0,
      other: 0,
      total: 0,
    };
  
    dataNomina.forEach(({ totals }) => {
      columnTotals.salary += totals.salary ? totals.salary : 2;
      columnTotals.overtimePay += totals.overtimePay ? totals.overtimePay : 0;
      columnTotals.sfs += totals.sfs ? totals.sfs : 0;
      columnTotals.afp += totals.afp ? totals.afp : 0;
      columnTotals.loans += totals.loans ? totals.loans : 0;
      columnTotals.other += totals.other ? totals.other : 0;
      columnTotals.total += totals.total ? totals.total : 0;
    });
    
    for (const key in columnTotals) {
      columnTotals[key] = parseFloat(columnTotals[key].toFixed(2));
    }
    return columnTotals;
  }

  useEffect(() => {
    setColumnTotals(calculateTotals(dataNomina));
  }, [dataNomina]);

  useEffect(() => {
    if (dataNomina.length <= 0) {
      fetchData(selectedYear)
    }
  }, []);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSizeQuincenal = 7;
  const pageSizeMonthly = 12;

  function updateDisplayData(quincenal: any[] | undefined, mensual: any[] | undefined) {
    const startIndex = (currentPage - 1) * pageSizeQuincenal;
    const endIndex = startIndex + pageSizeQuincenal;

    const startMonthly = (currentPage - 1) * pageSizeMonthly;
    const endMonthly = startIndex + pageSizeMonthly;

    if (quincenal && mensual) {
      setDisplayData(quincenal.slice(startIndex, endIndex));
      setDisplayMonthly(mensual.slice(startMonthly, endMonthly));
    } else {
      setDisplayData(dataNomina.slice(startIndex, endIndex));
      setDisplayMonthly(dataMonthly.slice(startMonthly, endMonthly));
    }
  }

  useEffect(() => {
    updateDisplayData(undefined, undefined);
  }, [currentPage]);

  // Tabs
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabClick = (index: number) => {
    if (selectedTab != index) {
      setSelectedTab(index);
      setCurrentPage(1);

      if (index == 0) {
        setTotalPages(Math.ceil(dataNomina.length/pageSizeQuincenal))
      } else {
        setTotalPages(Math.ceil(dataMonthly.length/pageSizeMonthly))
      }
    }
  };

  function tranformToMonthly(data: NominaData[]): Array<MonthlyData> {
    const transformedData: any[] = [];
  
    data.forEach(({ id, date, type, totals }) => {
      const month = DateTime.fromISO(date)
        .setLocale('es')
        .toFormat('MMMM yyyy')
        .replace(/^\w/, firstChar => firstChar.toUpperCase());

      const existingEntryIndex = transformedData.findIndex(entry => entry.month === month);
  
      if (existingEntryIndex !== -1) {
        const existingEntry = transformedData[existingEntryIndex];
        Object.keys(existingEntry.totals).forEach(key => {
          if (totals[key] !== null) {
            existingEntry.totals[key] = (existingEntry.totals[key] || 0) + totals[key];
          }
        });
      } else {
        const newEntry = {
          month,
          totals: { ...totals }
        };
        transformedData.push(newEntry);
      }
    });
  
    return transformedData;
  }
  
  return (
      <>
          <main>
            <Box position={'relative'} px={0} py={1}>
              {/* Tabs */}
              <Box position={'absolute'} top={"calc(-40px - 0.5rem)"} right={0}>
              <Box w='100%' p={1}>

              <Tabs h={'100%'} variant='unstyled'>
              <TabList h={'100%'} display={'flex'} alignItems={'end'} justifyContent={'right'} gap={3}>

              <Tab pl={12} pr={12} bg={'#F7FAFC'} textColor={'#008080'} borderRadius={8}
              _selected={{ color: 'white', bg: '#38B2AC' }}
              onClick={() => handleTabClick(0)}
              >
              Quincenal
              </Tab>

              <Tab pl={12} pr={12} bg={'#F7FAFC'} textColor={'#008080'} borderRadius={8}
              _selected={{ color: 'white', bg: '#38B2AC' }}
              onClick={() => handleTabClick(1)}
              >
              Mensual
              </Tab>

              </TabList>
              </Tabs>

              </Box>
              </Box>
              
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

                      : <Box>
                          { selectedTab == 0 ?
                          <Box h={'65vh'}>
                          <Card variant={'outline'}>
                              <CardBody p={0}>
                                  <TableContainer>
                                      <Table variant='striped'>
                                          <Thead>
                                              <Tr>
                                                  <Th>ID</Th>
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
                                              {displayData.map(({ id, date, type, totals }) => {
                                                  return (
                                                      <Tr key={id}>
                                                            <Td>{id}</Td>
                                                            <Td>{DateTime.fromISO(date)
                                                                .setLocale('es')
                                                                .toFormat('MMMM dd, yyyy')
                                                                .replace(/^\w/, firstChar => firstChar.toUpperCase())}</Td>
                                                            <Td>{totals.salary ? totals.salary.toLocaleString() : 0}</Td>
                                                            <Td>{totals.overtimePay ? totals.overtimePay.toLocaleString() : '0'}</Td>
                                                            <Td>{totals.sfs ? totals.sfs.toLocaleString() : '0'}</Td>
                                                            <Td>{totals.afp ? totals.afp.toLocaleString() : '0'}</Td>
                                                            <Td>{totals.loans ? totals.loans.toLocaleString() : '0'}</Td>
                                                            <Td>{totals.other ? totals.other.toLocaleString() : '0'}</Td>
                                                            <Td>{totals.total ? totals.total.toLocaleString() : '0'}</Td>
                                                          <Td>
                                                              <ButtonGroup variant='ghost' spacing='1' display={'flex'} justifyContent={'start'}>
                                                                <Tooltip label='Ir a nomina'>
                                                                    <IconButton colorScheme='blue' icon={<ViewIcon />} aria-label='Show'
                                                                    onClick={() => {
                                                                      setSearchId(id);
                                                                    }}>
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
                                              <Th>{columnTotals.salary ? columnTotals.salary.toLocaleString() : '0'}</Th>
                                              <Th>{columnTotals.overtimePay ? columnTotals.overtimePay.toLocaleString() : '0'}</Th>
                                              <Th>{columnTotals.sfs ? columnTotals.sfs.toLocaleString() : '0'}</Th>
                                              <Th>{columnTotals.afp ? columnTotals.afp.toLocaleString() : '0'}</Th>
                                              <Th>{columnTotals.loans ? columnTotals.loans.toLocaleString() : '0'}</Th>
                                              <Th>{columnTotals.other ? columnTotals.other.toLocaleString() : '0'}</Th>
                                              <Th>{columnTotals.total ? columnTotals.total.toLocaleString() : '0'}</Th>
                                              <Th></Th>
                                            </Tr>
                                          </Tfoot>
                                      </Table>
                                  </TableContainer>
                              </CardBody>
                          </Card>
                          </Box> :
                          
                          <Box>
                          <Card variant={'outline'} >
                              <CardBody p={0}>
                                  <TableContainer maxH={'70vh'} overflowY={'scroll'}>
                                      <Table variant='striped' position={'sticky'}>
                                          <Thead position={'sticky'} top={0} backgroundColor={'white'} zIndex={1}>
                                              <Tr boxShadow={'inset 0 -1px 0 #e2e8f0'}>
                                                  <Th colSpan={2}>Mes</Th>
                                                  <Th>Salario</Th>
                                                  <Th>Días Extra</Th>
                                                  <Th>SFS</Th>
                                                  <Th>AFP</Th>
                                                  <Th>Prestamos</Th>
                                                  <Th>Otros</Th>
                                                  <Th>Total</Th>

                                              </Tr>
                                          </Thead>
                                          <Tbody>
                                              {displayMonthly.map(({ month, totals }) => {
                                                  return (
                                                      <Tr key={month}>
                                                            <Td colSpan={2}>{month}</Td>
                                                            <Td>{totals.salary ? totals.salary.toLocaleString() : 0}</Td>
                                                            <Td>{totals.overtimePay ? totals.overtimePay.toLocaleString() : '0'}</Td>
                                                            <Td>{totals.sfs ? totals.sfs.toLocaleString() : '0'}</Td>
                                                            <Td>{totals.afp ? totals.afp.toLocaleString() : '0'}</Td>
                                                            <Td>{totals.loans ? totals.loans.toLocaleString() : '0'}</Td>
                                                            <Td>{totals.other ? totals.other.toLocaleString() : '0'}</Td>
                                                            <Td>{totals.total ? totals.total.toLocaleString() : '0'}</Td>

                                                      </Tr>
                                                  )
                                              })
                                              }
                                          </Tbody>
                                          <Tfoot position={'sticky'} bottom={-0.1} backgroundColor={'white'} zIndex={1}>
                                            <Tr boxShadow={'inset 0 1px 0 #e2e8f0'}>
                                              <Th colSpan={2}>Totales del año</Th>
                                              <Th>{columnTotals.salary ? columnTotals.salary.toLocaleString() : '0'}</Th>
                                              <Th>{columnTotals.overtimePay ? columnTotals.overtimePay.toLocaleString() : '0'}</Th>
                                              <Th>{columnTotals.sfs ? columnTotals.sfs.toLocaleString() : '0'}</Th>
                                              <Th>{columnTotals.afp ? columnTotals.afp.toLocaleString() : '0'}</Th>
                                              <Th>{columnTotals.loans ? columnTotals.loans.toLocaleString() : '0'}</Th>
                                              <Th>{columnTotals.other ? columnTotals.other.toLocaleString() : '0'}</Th>
                                              <Th>{columnTotals.total ? columnTotals.total.toLocaleString() : '0'}</Th>

                                            </Tr>
                                          </Tfoot>
                                      </Table>
                                  </TableContainer>
                              </CardBody>
                          </Card>
                          </Box>
                          }
                          
                          {/* Pagination */}
                          <Box display={selectedTab == 0 ? 'flex' : 'none'} justifyContent={'center'} px={2} pt={2} pb={0}>
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

