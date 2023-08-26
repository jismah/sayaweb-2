import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, FormControl, FormLabel, Input, Card, useToast, Box, Text, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, IconButton, Spinner, position, } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { SearchSelect, SearchSelectItem } from "@tremor/react";
import { DateTime } from 'luxon';
import { LockIcon, UnlockIcon } from '@chakra-ui/icons';

interface CreateNominaProps {
    isOpen: boolean;
    onClose: () => void;
    reloadData: (arg0: boolean) => void;
    reloadYear: (arg0: string) => void;
    id?: number;
    staffId?: number;
}

interface NominaProps {
    id: string;
    date: string;
}

interface StaffProps {
    id: string;
    name: string;
    lastName1: string;
    lastName2: string;
    salary: number
}

export default function CreateNomina({ isOpen, onClose, reloadData, reloadYear, id, staffId }: CreateNominaProps) {
    const router = useRouter();
    const toast = useToast(); 

    const [error, setError] = useState('');
    const [locked, setLocked] = useState(true);
    const [loading, setLoading] = useState(false);
    const [connected, setConnected] = useState(false);

    const [nominas, setNominas] = useState<Array<NominaProps>>([]);
    const [staff, setStaff] = useState<Array<StaffProps>>([]);
    const [staffButtonDisable, setButtonDisable] = useState(false);

    const [data, setData] = useState({
        idNomina: 0,
        idStaff: 0,
        date: "",
        salary: 0,
        extraDays: 0,
        overtimePay: 0,
        sfs: 0,
        afp: 0,
        loans: 0,
        other: 0,
        total: 0,
    });

    const handleLoadStaffData = () => {
        const foundStaff = staff.find(staffMember => Number(staffMember.id) === data.idStaff);
        const salary = foundStaff?.salary;

        setData(prevData => ({ ...prevData, salary: Number(salary) }))
    };

    const getStaffName = () => {
        const foundStaff = staff.find(staffMember => Number(staffMember.id) === data.idStaff);
        return foundStaff?.name + " " + foundStaff?.lastName1
    };

    const fetchNew = async () => {
        setLoading(true);
        setConnected(false);
    
        try {
          const res = await fetch(`http://localhost:3000/api/detailNomina/new`, {
            method: 'GET',
            headers: {
              "Content-Type": 'application/json',
              "x-api-key": "123456",
            },
          });
    
          const json = await res.json();
          console.log(json);
    
          const sortedDataNomina = [...json.response.nominas].sort((a, b) => {
            const dateA = DateTime.fromFormat(a.date, 'yyyy-MM-dd');
            const dateB = DateTime.fromFormat(b.date, 'yyyy-MM-dd');
            return dateB.toMillis() - dateA.toMillis();
          });

          const sortedDataStaff = [...json.response.staff].sort((a, b) => {
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

          setNominas(sortedDataNomina)
          setStaff(sortedDataStaff)

          setConnected(true);
    
        } catch (error) {
          console.error(error);
          setConnected(false);
        } finally {
          setLoading(false);
        }
    }

    useEffect(() => {
        if (!isOpen) {
            setData({
                idNomina: 0,
                idStaff: 0,
                date: "",
                salary: 0,
                extraDays: 0,
                overtimePay: 0,
                sfs: 0,
                afp: 0,
                loans: 0,
                other: 0,
                total: 0,
            });
            setError('');

        } else {
            fetchNew();
            setData(prevData => ({ ...prevData, idNomina: Number(id), idStaff: Number(staffId) }))
            setError('');
        }
    }, [isOpen]);

    useEffect(() => {
        setButtonDisable((Number.isNaN(data.idStaff) || data.idStaff === 0));
        setData(prevData => ({ ...prevData,
            salary: 0,
            extraDays: 0,
            overtimePay: 0,
            sfs: 0,
            afp: 0,
            loans: 0,
            other: 0,
        }))
    }, [data.idStaff]);

    useEffect(() => {
        if (locked) {
            setData(prevData => ({ ...prevData, 
                sfs: parseFloat((data.salary * (3.04 / 100)).toFixed(2)),
                afp: parseFloat((data.salary * (2.78 / 100)).toFixed(2)),
                overtimePay: parseFloat(((data.salary / 23.83) * data.extraDays).toFixed(2)) 
            }))
        }
    }, [data.salary, data.extraDays]);

    useEffect(() => {
        setData(prevData => ({ ...prevData, 
            total: calculateTotal()
        }))
    }, [data.salary, data.overtimePay, data.sfs, data.afp, data.loans, data.other]);

    const calculateTotal = () => {
        return parseFloat((Number(data.salary) + Number(data.overtimePay) - Number(data.sfs)
        - Number(data.afp) - Number(data.loans) - Number(data.other)).toFixed(2));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (Number.isNaN(data.idNomina) || data.idNomina === 0) {
            setError("Debe seleccionar una nomina para continuar");
        } else if (Number.isNaN(data.idStaff) || data.idStaff === 0) {
            setError("Debe seleccionar una empleado para continuar");
        } else {
            const found = nominas.find(nomina => Number(nomina.id) === data.idNomina);
            const dateFound = found?.date ? found?.date : "";

            const stringifiedData = {
                idNomina: data.idNomina.toString(),
                idStaff: data.idStaff.toString(),
                date: dateFound,
                salary: data.salary.toString(),
                extraDays: data.extraDays.toString(),
                overtimePay: data.overtimePay.toString(),
                sfs: data.sfs.toString(),
                afp: data.afp.toString(),
                loans: data.loans.toString(),
                other: data.other.toString(),
                total: data.total.toString(),
            };

            try {
                const res = await fetch('http://localhost:3000/api/detailNomina', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "123456",
                    },
                    body: JSON.stringify(stringifiedData),
                });
                const json = await res.json();

                if (json.code.toString() === '200') {
                    toast({
                        title: `Detalle de nomina creado`,
                        description: `Para ${getStaffName()} para ${DateTime.fromISO(dateFound)
                            .setLocale('es')
                            .toFormat('MMMM dd yyyy')}`,
                        status: 'success',
                        position: 'bottom-right',
                        duration: 4000,
                        isClosable: true,
                    })

                    onClose();

                    if (id || staffId) {
                        reloadData(true);
                        reloadYear(DateTime.fromISO(dateFound).toFormat('yyyy'));
                    } else {
                        router.push(`/App/Nomina?id=${data.idNomina}`);
                    }
                } else {
                    console.log(data)
                    console.log(json)
                    toast({
                        title: `Error`,
                        description: `Hubo un error al intenrar crear el detalle de nomina`,
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
                    description: `Hubo un error al intenrar crear el detalle de nomina`,
                    status: 'error',
                    position: 'bottom-right',
                    duration: 4000,
                    isClosable: true,
                })
            }
        }
    };

    return (
        <Modal onClose={onClose} size="full" isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent maxW={'1000px'} minH={'48vh'} alignSelf={'center'} borderRadius={8} p={8}>
                <ModalHeader textAlign={'center'}>Nuevo Detalle Nomina</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit} autoComplete='off' style={{ position: 'relative' }}>
                        {loading && <Box pos={'absolute'} top={-9} right={5} zIndex={1} h={'25px'} w={'25px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            <Spinner w={'100%'} h={'100%'} color='teal' size='x1' thickness='2px' />
                        </Box>}

                        {!loading && !connected && 
                        <Text color={'#C44D4D'} textAlign={'center'} pb={2}>Ocurrió un error al conectar con el servidor. Revise su conexión e intente de nuevo.</Text>}
                        {!loading && connected && error != '' &&
                        <Text color={'#C44D4D'} textAlign={'center'} pb={2}>{error}</Text>}
                        <Card variant={'outline'} display={'flex'} flexDirection={'column'} gap={'20px'} borderRadius={8} p={4} >
                            <FormControl>
                                <FormLabel>Nomina</FormLabel>
                                <SearchSelect placeholder='Selecciona una nomina' value={data.idNomina}
                                    onChange={(value) => setData(prevData => ({ ...prevData, idNomina: Number(value) }))}>
                                    {nominas.map(item => (
                                        <SearchSelectItem key={item.id} value={item.id} >
                                            <Box position={'relative'}>
                                                <Text pl={'50px'}>{DateTime.fromISO(item.date)
                                                    .setLocale('es')
                                                    .toFormat('MMMM dd yyyy')
                                                    .replace(/^\w/, firstChar => firstChar.toUpperCase())}
                                                </Text>
                                                <Text color={'#38b2ac'} fontSize='xs' position={'absolute'} left={0} top={0.4}>   ID: {item.id}</Text>
                                            </Box>
                                        </SearchSelectItem>
                                    ))}
                                </SearchSelect>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Empleado</FormLabel>
                                <SearchSelect placeholder='Selecciona una empleado' value={data.idStaff}
                                    onChange={(value) => setData(prevData => ({ ...prevData, idStaff: Number(value) }))}>
                                    {staff.map(item => (
                                        <SearchSelectItem key={item.id} value={item.id} >
                                            <Box position={'relative'}>
                                                <Text pl={'50px'}>{item.name} {item.lastName1} {item.lastName2}</Text>
                                                <Text color={'#38b2ac'} fontSize='xs' position={'absolute'} left={0} top={0.4}>   ID: {item.id}</Text>
                                            </Box>
                                        </SearchSelectItem>
                                    ))}
                                </SearchSelect>
                            </FormControl>
                        </Card>
                        
                        <Box mt={5} display={'flex'} flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
                            <Button w={'25%'} size='sm' variant={'outline'} isDisabled={staffButtonDisable} 
                            onClick={handleLoadStaffData}>Cargar datos de empleado</Button>

                            <IconButton opacity={0.7} bg={'transparent'} aria-label='Unlock' icon={locked ? <LockIcon /> : <UnlockIcon />} 
                            onClick={() => {setLocked(!locked)} }/>
                        </Box>
                        <Card variant={'outline'} display={'flex'} flexDirection={'row'} gap={4} borderRadius={8} mt={2} p={4} >            
                            <Box display={'flex'} flexDirection={'column'} gap={'20px'} w={'100%'}>
                                <FormControl>
                                    <FormLabel>Salario</FormLabel>
                                    <NumberInput color={'#38b2ac'} min={0} precision={2} step={1} defaultValue={0}
                                    value={data.salary} onChange={(value) => setData({ ...data, salary: value })}>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper color={'#38b2ac'} />
                                            <NumberDecrementStepper color={'#38b2ac'} />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Días extras</FormLabel>
                                    <NumberInput color={'#38b2ac'} min={0} precision={0} step={1} defaultValue={0}
                                    value={data.extraDays} onChange={(value) => setData({ ...data, extraDays: value })}>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper color={'#38b2ac'} />
                                            <NumberDecrementStepper color={'#38b2ac'} />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Prestamos</FormLabel>
                                    <NumberInput color={'#38b2ac'} min={0} precision={2} step={1} defaultValue={0}
                                    value={data.loans} onChange={(value) => setData({ ...data, loans: value })}>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper color={'#38b2ac'} />
                                            <NumberDecrementStepper color={'#38b2ac'} />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Otro</FormLabel>
                                    <NumberInput color={'#38b2ac'} min={0} precision={2} step={1} defaultValue={0}
                                    value={data.other} onChange={(value) => setData({ ...data, other: value })}>
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper color={'#38b2ac'} />
                                            <NumberDecrementStepper color={'#38b2ac'} />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                            </Box>
                            
                            <Box display={'flex'} flexDirection={'column'} gap={'20px'} w={'100%'}>
                                <FormControl>
                                    <FormLabel>Pago por horas extras</FormLabel>
                                    <NumberInput isReadOnly={locked} color={'#38b2ac'} min={0} precision={2} step={1} defaultValue={0}
                                    value={data.overtimePay} onChange={(value) => setData({ ...data, overtimePay: value })}>
                                        <NumberInputField />
                                        <NumberInputStepper display={locked ? 'none': 'flex'}>
                                            <NumberIncrementStepper color={'#38b2ac'} />
                                            <NumberDecrementStepper color={'#38b2ac'} />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>SFS</FormLabel>
                                    <NumberInput isReadOnly={locked} color={'#38b2ac'} min={0} precision={2} step={1} defaultValue={0}
                                    value={data.sfs} onChange={(value) => setData({ ...data, sfs: value })}>
                                        <NumberInputField />
                                        <NumberInputStepper display={locked ? 'none': 'flex'}>
                                            <NumberIncrementStepper color={'#38b2ac'} />
                                            <NumberDecrementStepper color={'#38b2ac'} />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>AFP</FormLabel>
                                    <NumberInput isReadOnly={locked} color={'#38b2ac'} min={0} precision={2} step={1} defaultValue={0}
                                    value={data.afp} onChange={(value) => setData({ ...data, afp: value })}>
                                        <NumberInputField />
                                        <NumberInputStepper display={locked ? 'none': 'flex'}>
                                            <NumberIncrementStepper color={'#38b2ac'} />
                                            <NumberDecrementStepper color={'#38b2ac'} />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Total</FormLabel>
                                    <NumberInput color={'#38b2ac'} min={0} precision={2} step={1} defaultValue={0}
                                    value={data.total} isReadOnly={true}>
                                        <NumberInputField />
                                    </NumberInput>
                                </FormControl>
                            </Box>
                        </Card>
                        
                        <Button  type="submit" mt={4} colorScheme="teal">Crear</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
