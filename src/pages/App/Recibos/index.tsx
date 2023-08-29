import { AddIcon, ChevronLeftIcon, ChevronRightIcon, DeleteIcon, DownloadIcon, EditIcon, RepeatIcon } from '@chakra-ui/icons';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, ButtonGroup, Card, CardBody, Flex, FormControl, FormLabel, HStack, Heading, IconButton, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, Select, Spinner, Table, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tooltip, Tr, useToast } from '@chakra-ui/react';
import { useUser } from '@supabase/auth-helpers-react';
import { SearchSelect, SearchSelectItem } from '@tremor/react';
import { DateTime } from 'luxon';
import { NextPage } from 'next';
import router from 'next/router';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { BiSolidReceipt } from "react-icons/bi";

interface ResponseData {
    id: string;
    name: string;
    students: string;
    receipts: string;
}

interface Family {
    id: string;
    name: string;
    students: any[];
    receipts: any[];
}

interface ReceiptData {
    id: string;
    date: string;
    nameFrom: string;
    amount: string;
    textAmount: string;
    concept: string;
    method: string;
    idFamily: string;
}

const Recibos: NextPage = () => {
    const user = useUser();

    const toast = useToast();

    const [dataFamilies, setDataFamilies] = useState<Array<ResponseData>>([]);
    const [displayData, setDisplayData] = useState<Array<ResponseData>>([]);

    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(false);

    const [date, setDate] = useState('');
    const [byFamily, setByFamily] = useState(false);
    const [FamilyId, setFamilyId] = useState('');
    const [FamilyName, setFamilyName] = useState('');
    const [dataReceipts, setDataReceipts] = useState<Array<ReceiptData>>([]);
    const [displayReceipts, setDisplayReceipts] = useState<Array<ReceiptData>>([]);

    const handleSearchById = (idFamily: string, name: string) => {
        setByFamily(true);
        setDataReceipts([]);
        setDisplayReceipts([]);

        setFamilyName(name)
        setFamilyId(idFamily);
        fetchById(idFamily);
    }
    
    const handleDateSearch = () => {
        fetchByDate(FamilyId)
    }

    const fetchByDate = async (idFamily: string) => {
        setLoading(true);
        setConnected(false);
        
        const year = DateTime.fromISO(date).toFormat('yyyy');
        const month = DateTime.fromISO(date).toFormat('MM');
        const day = DateTime.fromISO(date).toFormat('dd');

        try {
            const res = await fetch(`https://sayaserver.onrender.com/api/receipts/${idFamily}?year=${year}&month=${month}&day=${day}`, {
              method: 'GET',
              headers: {
                "Content-Type": 'application/json',
                "x-api-key": "123456",
              },
            });
      
            const json = await res.json();
            console.log(json);
              
            const sortedDataReceipts = [...json.response].sort((a, b) => {
                const dateA = DateTime.fromFormat(a.date, 'yyyy-MM-dd');
                const dateB = DateTime.fromFormat(b.date, 'yyyy-MM-dd');
                return dateB.toMillis() - dateA.toMillis();
            });   
      
            setDataReceipts(sortedDataReceipts);
      
            setCurrentPage(1);
            updateDisplayReceipts(sortedDataReceipts);
            setTotalPages(Math.ceil(json.total/pageSizeReceipts));
      
            setConnected(true);
      
          } catch (error) {
            console.error(error);
            setConnected(false);
          } finally {
            setLoading(false);
          }
    }

    const fetchById = async (idFamily: string) => {
        setLoading(true);
        setConnected(false);
        
        try {
            const res = await fetch(`https://sayaserver.onrender.com/api/receipts/family/${idFamily}`, {
              method: 'GET',
              headers: {
                "Content-Type": 'application/json',
                "x-api-key": "123456",
              },
            });
      
            const json = await res.json();
            console.log(json);
              
            const sortedDataReceipts = [...json.response].sort((a, b) => {
                const dateA = DateTime.fromFormat(a.date, 'yyyy-MM-dd');
                const dateB = DateTime.fromFormat(b.date, 'yyyy-MM-dd');
                return dateB.toMillis() - dateA.toMillis();
            });   
      
            setDataReceipts(sortedDataReceipts);
      
            setCurrentPage(1);
            updateDisplayReceipts(sortedDataReceipts);
            setTotalPages(Math.ceil(json.total/pageSizeReceipts));
      
            setConnected(true);
      
          } catch (error) {
            console.error(error);
            setConnected(false);
          } finally {
            setLoading(false);
          }
    }
  
    // GET DATA TO LOAD ARRAY
    const fetchData = async () => {
      setLoading(true);
      setConnected(false);
  
      try {
        const res = await fetch(`https://sayaserver.onrender.com/api/family/info/receipts`, {
          method: 'GET',
          headers: {
            "Content-Type": 'application/json',
            "x-api-key": "123456",
          },
        });
  
        const json = await res.json();
        console.log(json);
  
        const transformedData: ResponseData[] = json.response.map((item: Family) => {
            return {
              id: item.id,
              name: item.name,
              students: item.students.length,
              receipts: item.receipts.length,
            };
        });
          
        const sortedDataFamilies = transformedData.sort((a: any, b: any) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();

            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });     
  
        setDataFamilies(sortedDataFamilies);
  
        setCurrentPage(1);
        updateDisplayData(sortedDataFamilies);
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
    const pageSize = 9;
    const pageSizeReceipts = 9;
  
    function updateDisplayData(data: ResponseData[] | undefined) {
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
  
      if (data) {
        setDisplayData(data.slice(startIndex, endIndex));
      } else {
        setDisplayData(dataFamilies.slice(startIndex, endIndex));
      }
    }

    function updateDisplayReceipts(data: ReceiptData[] | undefined) {
        const startIndex = (currentPage - 1) * pageSizeReceipts;
        const endIndex = startIndex + pageSizeReceipts;

        if (data) {
            setDisplayReceipts(data.slice(startIndex, endIndex));
        } else {
            setDisplayReceipts(dataReceipts.slice(startIndex, endIndex));
        }
    }
  
    useEffect(() => {
      updateDisplayData(undefined);
      updateDisplayReceipts(undefined);
    }, [currentPage]);

    const [processing, setProcessing] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [deleteId, setDeleteId] = useState('');
    const [deleteDate, setDeleteDate] = useState('');

    const onDeleteClose = () => setDeleteOpen(false);
    const cancelRef = useRef<HTMLButtonElement | null>(null);

    const openDelete = (id: string, date: string) => {
        setDeleteId(id);
        setDeleteDate(date);
        setDeleteOpen(true);
    }
  
    const handleDelete = async () => {
        setProcessing(true);

        try {
            const res = await fetch(`https://sayaserver.onrender.com/api/receipts/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                }
            });
            const json = await res.json();

            if (json.code.toString() === '200') {
                toast({
                    title: `Recibo #${deleteId} eliminado`,
                    description: `Se elimino correctamente el recibo #${deleteId}`,
                    status: 'success',
                    position: 'bottom-right',
                    duration: 4000,
                    isClosable: true,
                })

                onDeleteClose();
                handleSearchById(FamilyId, FamilyName);
            } else {
                toast({
                    title: `Error`,
                    description: `Ocurrio un error al intentar eliminar el recibo`,
                    status: 'error',
                    position: 'bottom-right',
                    duration: 4000,
                    isClosable: true,
                }) 
            }
        } catch (error: any) {
            console.log(error);
            toast({
                title: `Error`,
                description: `Ocurrio un error al intentar eliminar el recibo`,
                status: 'error',
                position: 'bottom-right',
                duration: 4000,
                isClosable: true,
            })
        } finally {
            setProcessing(false);
            onDeleteClose()
        }
    };

    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState({
        idFamily: '',
        date: '',
        nameFrom: '',
        amount: '',
        textAmount: '',
        concept: '',
        method: '',
    })
    const [error, setError] = useState('');

    const openModal = () => {
        if (byFamily) {
            setData(prevData => ({ ...prevData, idFamily: FamilyId.toString() }))
        }
        setError('');
        setIsOpen(true);
    };

    const onClose = () => {
        setIsOpen(false);
        setData({
            idFamily: '',
            date: '',
            nameFrom: '',
            amount: '',
            textAmount: '',
            concept: '',
            method: '',
        })
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError('');
        
        if (data.date === '') {
            setError('Seleccione una fecha');
        } else if (parseFloat(data.amount) <= 0) {
            setError('Ingrese una cantidad');
        } else if (data.concept === '') {
            setError('Ingrese un concepto');
        } else if (data.idFamily === '') {
            setError('Seleccione una familia');
        } else if (data.method === '') {
            setError('Seleccione un metodo de pago');
        } else if (data.nameFrom === '') {
            setError('Ingrese un nombre');
        } else if (data.textAmount === '') {
            setError('Ingrese la cantidad textual');
        } else {
            console.log("Amount", parseFloat(data.amount).toFixed(2))
            try {
                const res = await fetch('https://sayaserver.onrender.com/api/receipts', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "123456",
                    },
                    body: JSON.stringify({
                        idFamily: data.idFamily,
                        date: data.date,
                        nameFrom: data.nameFrom,
                        amount: parseFloat(data.amount).toFixed(2),
                        textAmount: data.textAmount,
                        concept: data.concept,
                        method: data.method,
                    }),
                });
                const json = await res.json();
                const id = await json.response.id

                if (json.code.toString() === '200') {
                    toast({
                        title: `Recibo Creado`,
                        description: `Se creo una correctamente uel recibo`,
                        status: 'success',
                        position: 'bottom-right',
                        duration: 4000,
                        isClosable: true,
                    })
                    
                    handleSearchById(FamilyId, FamilyName);
                    onClose();
                } else {
                    toast({
                        title: `Error`,
                        description: `Ocurrio un error al intentar crear el recibo`,
                        status: 'error',
                        position: 'bottom-right',
                        duration: 4000,
                        isClosable: true,
                    }) 
                }
            } catch (error: any) {
                console.log(error);
                toast({
                    title: `Error`,
                    description: `Ocurrio un error al intentar crear el recibo`,
                    status: 'error',
                    position: 'bottom-right',
                    duration: 4000,
                    isClosable: true,
                })
            } finally {
                setProcessing(false);
            }

        }
        setProcessing(false);
    };

    const [downloading, setDownloading] = useState(false);
    const [idDownloading, setIdDownloading] = useState('');
    const handleDownload = async (id: string, nameFrom: string, date: string) => {
        if (downloading) return;
        setIdDownloading(id);

        try {
            setDownloading(true);
            const response = await fetch(`https://sayaserver.onrender.com/api/Receipts/pdf/${id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                }
            });
            if (!response.ok) {
                console.error('Error:', response.statusText);
                return;
            }

            const pdfBlob = await response.blob();
            const blobUrl = URL.createObjectURL(pdfBlob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `Recibo para ${nameFrom} (${DateTime.fromISO(date)
                                .setLocale('es')
                                .toFormat('MMMM dd, yyyy')
                                .replace(/^\w/, firstChar => firstChar.toUpperCase())}).pdf`;
            link.dispatchEvent(new MouseEvent('click'));

            URL.revokeObjectURL(blobUrl);
            toast({
                title: `Descarga en proceso`,
                description: `Se genero el pdf del recibo #${id}`,
                status: 'success',
                position: 'bottom-right',
                duration: 4000,
                isClosable: true,
            })
        } catch (error) {
            console.error(error);

            toast({
                title: `Error`,
                description: `Ocurrio un error al intentar descargar el recibo`,
                status: 'error',
                position: 'bottom-right',
                duration: 4000,
                isClosable: true,
            })
        } finally {
            setDownloading(false);
            setIdDownloading('');
        }
    };

    useEffect(() => {
        if (!user) {
            router.push('/Auth/Login');
        } else {
            fetchData();
        }
    }, []);

    return (
        <>
            <main>

            <Modal onClose={onClose} size="full" isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent maxW={'800px'} minH={'48vh'} alignSelf={'center'} borderRadius={8} p={8}>
                <ModalHeader textAlign={'center'}>Crear Recibo</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit} autoComplete='off'>
                        <Card variant={'outline'} display={'flex'} flexDirection={'column'} borderRadius={8} p={4} gap={4}>

                            <FormControl>
                                <FormLabel>Familia</FormLabel>
                                <SearchSelect placeholder='Selecciona una familia' value={data.idFamily}
                                    onChange={(value) => 
                                        setData(prevData => ({ ...prevData, idFamily: value.toString() }))
                                    }>
                                    {dataFamilies.map(item => (
                                        <SearchSelectItem key={item.id.toString()} value={item.id.toString()} >
                                            <Box position={'relative'}>
                                                <Text pl={'50px'}>{item.name}</Text>
                                                <Text color={'#38b2ac'} fontSize='xs' position={'absolute'} left={0} top={0.4}>   ID: {item.id}</Text>
                                            </Box>
                                        </SearchSelectItem>
                                    ))}
                                </SearchSelect>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Fecha</FormLabel>
                                <Input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData({ ...data, date: e.target.value.toString() })}
                                />
                                
                            </FormControl>

                            <FormControl>
                                <FormLabel>Nombre</FormLabel>
                                <Input type='text' value={data.nameFrom}
                                onChange={(e) => setData({ ...data, nameFrom: e.target.value.toString() })}/>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Cantidad</FormLabel>
                                <NumberInput color={'#38b2ac'} min={0} precision={2} step={1} defaultValue={0}
                                value={data.amount} onChange={(value) => setData({ ...data, amount: value })}>
                                    <NumberInputField />
                                    <NumberInputStepper>
                                        <NumberIncrementStepper color={'#38b2ac'} />
                                        <NumberDecrementStepper color={'#38b2ac'} />
                                    </NumberInputStepper>
                                </NumberInput>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Cantidad Textual</FormLabel>
                                <Input type='text' value={data.textAmount}
                                onChange={(e) => setData({ ...data, textAmount: e.target.value.toString() })}/>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Concepto</FormLabel>
                                <Input type='text' value={data.concept}
                                onChange={(e) => setData({ ...data, concept: e.target.value.toString() })}/>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Metodo de Pago</FormLabel>
                                <Select placeholder='Selecciona uno' value={data.method}
                                onChange={(e) => setData({ ...data, method: e.target.value.toString() })}>
                                    <option value='Efectivo'>Efectivo</option>
                                    <option value='Deposito en Cuenta'>Deposito en Cuenta</option>
                                    <option value='Transferencia Bancaria'>Transferencia Bancaria</option>
                                </Select>
                            </FormControl>
                            
                            {error && <p style={{ color: '#C44D4D' }}>{error}</p>}
                        </Card>
                        
                        {/* Submit Button */}
                        <Box display={'flex'} flexDirection={'row'} gap={3} mt={4} alignItems={'center'}>
                            <Button type="submit" colorScheme="teal">Crear</Button>

                            {processing && <Box ml={3} h={'25px'} w={'25px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Spinner w={'100%'} h={'100%'} color='teal' size='x1' thickness='2px' />
                            </Box>}
                        </Box>
                    </form>
                </ModalBody>
            </ModalContent>
            </Modal>

                <Box px={3} py={3}>
                    {/* Buttons */}
                    <Flex justifyContent={'space-between'} alignItems={'center'}>
                        <Heading as='h3' size='xl'><Link href='/App/Recibos' textDecoration={'none'}>Recibos</Link></Heading>
                        <ButtonGroup gap={3} alignItems={'center'}>
                            <Button size='sm' variant={'outline'} leftIcon={<AddIcon />} onClick={openModal}>
                                Nuevo Recibo
                            </Button>
                        </ButtonGroup>
                    </Flex>

                    {loading ?
                    <Box mt={4}>
                        <Card variant={'outline'}>
                            <CardBody>
                                <Box height={'69vh'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <Spinner color='teal' size='xl' thickness='3px' />
                                </Box>
                            </CardBody>
                        </Card>
                    </Box>
                    : !connected ?
                    <Box mt={4}><Card variant={'outline'} px={0} py={200}>
                        <Text textAlign={'center'} textColor={'#C44D4D'}>No se logro conectar con el servidor</Text>
                    </Card></Box>
                
                    : (byFamily && dataReceipts.length <= 0) ?
                    <Box mt={4}><Card variant={'outline'} px={0} py={200} display={'flex'} flexDirection={'column'} gap={4} alignItems={'center'}>
                        <Text textAlign={'center'}>No se encontraron records para mostrar</Text>
                    </Card></Box>

                    : (byFamily && dataReceipts.length > 0) ?
                    <Box mt={4}>
                        <Box py={4} display={'flex'} gap={2}>
                            <Input
                            maxW={'180px'}
                            type="date"
                            value={date}
                            onChange={(e) => {setDate(e.target.value)}}
                            />

                            <Button
                                alignSelf={'end'}
                                variant={'outline'}
                                fontWeight={400}
                                textColor={'#008080'}
                                onClick={handleDateSearch}
                            >
                                Buscar
                            </Button>

                            <IconButton
                                alignSelf={'end'}
                                bg={'transparent'}
                                aria-label={'Reset Search'}
                                opacity={0.7}
                                icon={<RepeatIcon />}
                                onClick={() => {
                                    if (date != '') {
                                        handleSearchById(FamilyId, FamilyName)
                                        setDate('');
                                    }
                                }}
                        ></IconButton>
                        </Box>
                        

                        <Box position={'relative'} h={'78vh'}>
                        <Box position={'absolute'} right={1} top={'-45px'} display={'flex'} gap={'20px'}>

                            <Box display={'flex'} gap={4} alignItems={'center'} justifyContent={'center'} pr={12} pl={12} py={4} 
                                minW={'340.44px'} h={'49.33px'}
                                bg={'rgba(247, 250, 252, 0.7)'} borderRadius={'8px 8px 0 0'} border={'1px solid #edf2f7'}>

                                <Text fontSize={'18px'} fontWeight={600} color={'#38B2AC'}>{`Familia ${FamilyName}`}</Text>
                            </Box>

                            </Box> 
                        <Card variant={'outline'}>
                            <CardBody p={0}>
                                <TableContainer>
                                    <Table variant='striped'>
                                        <Thead>
                                            <Tr>
                                                <Th>ID Recibo</Th>
                                                <Th>Fecha</Th>
                                                <Th>Nombre</Th>
                                                <Th>Cantiadad</Th>
                                                <Th>Concepto</Th>
                                                <Th>Metodo</Th>
                                                <Th>Acciones</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {displayReceipts.map(({ id, date, nameFrom, amount, textAmount, concept, method, idFamily }) => {
                                                return (
                                                <Fragment key={id}>
                                                <Tr>
                                                    <Td>{ id }</Td>
                                                    <Td>{ DateTime.fromISO(date)
                                                        .setLocale('es')
                                                        .toFormat('MMMM dd, yyyy')
                                                        .replace(/^\w/, firstChar => firstChar.toUpperCase()) }
                                                    </Td>
                                                    <Td>{ nameFrom }</Td>
                                                    <Td>{ parseFloat(amount).toFixed(2) }</Td>
                                                    <Td>{ concept }</Td>
                                                    <Td>{ method }</Td>
                                                    <Td>
                                                    <ButtonGroup variant="ghost" spacing="1">
                                                        <Tooltip label={downloading && idDownloading == id ? 'Descargando...' : 'Descargar'}>
                                                            <IconButton isDisabled={downloading} colorScheme="blue" icon={downloading && idDownloading == id ? <Spinner color='blue' size='sm' thickness='2px' /> : <DownloadIcon />} aria-label="Download"
                                                            onClick={() => {
                                                                handleDownload(id.toString(), nameFrom.toString(), date.toString())
                                                            }} />
                                                        </Tooltip>
                                                        <Tooltip label='Borrar'>
                                                            <IconButton colorScheme="red" onClick={() => {
                                                                openDelete(id, date);
                                                            }} icon={<DeleteIcon />} aria-label="Delete"/>
                                                        </Tooltip>
                                                    </ButtonGroup>
                                                    </Td>
                                                </Tr>
                                                </Fragment>
                                                )
                                            })
                                            }
                                        </Tbody>
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

                        <AlertDialog isOpen={deleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
                                <AlertDialogOverlay>
                                <AlertDialogContent alignSelf={'center'}>
                                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                    Confirmar Eliminación
                                    </AlertDialogHeader>

                                    <AlertDialogBody>
                                        <Text>¿Estás seguro de que deseas eliminar este recibo?</Text>
                                        <Card mt={3} variant={'outline'} bg={'#f9fbfd'} p={4} display={'flex'} gap={3} fontWeight={600} opacity={0.7}>
                                            <Text>ID: #{deleteId}</Text>
                                            <Text>Fecha: {DateTime.fromISO(deleteDate)
                                                    .setLocale('es')
                                                    .toFormat('MMMM dd, yyyy')
                                                    .replace(/^\w/, firstChar => firstChar.toUpperCase())
                                            }</Text>
                                            <Text>Familia: {FamilyName}</Text>
                                        </Card>
                                    </AlertDialogBody>

                                    <AlertDialogFooter>
                                        <Box display={'flex'} flexDirection={'row'} gap={0} alignItems={'center'} justifyContent={'space-between'} w={'100%'}>

                                            {processing ?
                                                <Box h={'25px'} w={'25px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                                    <Spinner w={'100%'} h={'100%'} color='teal' size='x1' thickness='2px' />
                                                </Box>
                                            :<Box></Box>
                                            }
                                            
                                            <Box>
                                                <Button ref={cancelRef} onClick={onDeleteClose}>
                                                    Cancelar
                                                </Button>
                                                <Button colorScheme="red" onClick={handleDelete} ml={3}>
                                                    Eliminar
                                                </Button>
                                            </Box>
                                        </Box>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                                </AlertDialogOverlay>
                            </AlertDialog>
                    </Box>

                    : (!byFamily && dataFamilies.length <= 0) ? 
                    <Box mt={4}><Card variant={'outline'} px={0} py={200} display={'flex'} flexDirection={'column'} gap={4} alignItems={'center'}>
                        <Text textAlign={'center'}>No se encontraron records para mostrar</Text>
                    </Card></Box>

                    : <Box mt={4}>
                        <Box h={'78vh'}>
                        <Card variant={'outline'}>
                            <CardBody p={0}>
                                <TableContainer>
                                    <Table variant='striped'>
                                        <Thead>
                                            <Tr>
                                                <Th>ID Familia</Th>
                                                <Th>Nombres</Th>
                                                <Th>Estudiantes</Th>
                                                <Th>Recibos Totales</Th>
                                                <Th>Acciones</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {displayData.map(({ id, name, students, receipts }) => {
                                                return (
                                                <Fragment key={id}>
                                                <Tr>
                                                    <Td>{ id }</Td>
                                                    <Td>{ name }</Td>
                                                    <Td>{ students }</Td>
                                                    <Td>{ receipts }</Td>
                                                    <Td>
                                                    <ButtonGroup variant="ghost" spacing="1">
                                                        <Tooltip label='Ver Recibos'>
                                                        <IconButton colorScheme="blue" icon={<BiSolidReceipt />} aria-label="Ver Recibos" onClick={() => {
                                                            handleSearchById(id, name);
                                                        }}/>
                                                        </Tooltip>
                                                    </ButtonGroup>
                                                    </Td>
                                                </Tr>
                                                </Fragment>
                                                )
                                            })
                                            }
                                        </Tbody>
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

export default Recibos;