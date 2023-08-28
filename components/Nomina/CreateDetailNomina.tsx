import React, { useEffect, useRef, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, FormControl, FormLabel, Card, useToast, Box, Text, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, IconButton, Spinner, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, } from '@chakra-ui/react';
import { SearchSelect, SearchSelectItem } from "@tremor/react";
import { DateTime } from 'luxon';
import { LockIcon, UnlockIcon } from '@chakra-ui/icons';

interface Data {
    idNomina: string,
    idStaff: string,
    date: string,
    salary: string,
    extraDays: string,
    overtimePay: string,
    sfs: string,
    afp: string,
    loans: string,
    other: string,
    total: number,
}

interface CreateNominaProps {
    isOpen: boolean;
    onClose: () => void;
    id?: string;
    staffId?: string;
    editMode: boolean;
    editData: Data;
    setters: {
        reloadData: (arg0: boolean) => void;
        reloadYear: (arg0: string) => void;
        setEditMode: (arg0: boolean) => void,
        setEditData: (arg0: Data) => void,
        remoteSearchId: (arg0: string) => void;
    }
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

export default function CreateNomina({ isOpen, onClose, id, staffId, editMode, editData, setters }: CreateNominaProps) {
    const toast = useToast(); 

    const [error, setError] = useState('');
    const [locked, setLocked] = useState(true);
    const [resetOnChange, setResetOnChange] = useState(true);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [connected, setConnected] = useState(false);

    const [nominas, setNominas] = useState<Array<NominaProps>>([]);
    const [staff, setStaff] = useState<Array<StaffProps>>([]);
    const [staffButtonDisable, setButtonDisable] = useState(false);

    const [data, setData] = useState({
        idNomina: '0',
        idStaff: '0',
        date: "",
        salary: '0',
        extraDays: '0',
        overtimePay: '0',
        sfs: '0',
        afp: '0',
        loans: '0',
        other: '0',
        total: 0,
    });

    const handleLoadStaffData = () => {
        const foundStaff = staff.find(staffMember => staffMember.id.toString() === data.idStaff);
        const salary = foundStaff?.salary;

        setData(prevData => ({ ...prevData, salary: salary ? salary.toString() : '0' }))
    };

    const getStaffName = () => {
        const foundStaff = staff.find(staffMember => staffMember.id.toString() === data.idStaff);
        return foundStaff?.name + " " + foundStaff?.lastName1
    };

    const getDate = () => {
        const found = nominas.find(nomina => nomina.id.toString() === data.idNomina);
        return found?.date ? found?.date : "";
    }

    const fetchNew = async () => {
        setLoading(true);
        setConnected(false);
    
        try {
          const res = await fetch(`https://sayaserver.onrender.com/api/detailNomina/new`, {
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
                idNomina: '0',
                idStaff: '0',
                date: "",
                salary: '0',
                extraDays: '0',
                overtimePay: '0',
                sfs: '0',
                afp: '0',
                loans: '0',
                other: '0',
                total: 0,
            });
            setError('');
            handleExit();

        } else {
            fetchNew();
            setError('');

            if (editMode && editData) {
                setLocked(checkLocking());
                setResetOnChange(false)
                setData(editData);
            } else {
                setData(prevData => ({ ...prevData, idNomina: id ? id : '0', idStaff: staffId ? staffId : '0' }));
            }
        }
    }, [isOpen]);

    const checkLocking = () => {
        const sfs = parseFloat((parseFloat(editData.salary) * (3.04 / 100)).toFixed(2));
        const afp = parseFloat((parseFloat(editData.salary) * (2.78 / 100)).toFixed(2));
        const overtimePay = parseFloat(((parseFloat(editData.salary) / 23.83) * Number(editData.extraDays)).toFixed(2));

        
        if (parseFloat(editData.sfs) != sfs) {
            return false
        }
        if (parseFloat(editData.afp) != afp) {
            return false
        }
        if (parseFloat(editData.overtimePay) != overtimePay) {
            return false
        }
        
        return true;
    }

    useEffect(() => {
        setButtonDisable((Number.isNaN(data.idStaff) || Number(data.idStaff) === 0));
        if (resetOnChange) {
            setData(prevData => ({ ...prevData,
                salary: '0',
                extraDays: '0',
                overtimePay: '0',
                sfs: '0',
                afp: '0',
                loans: '0',
                other: '0',
            }))
        } else {
            setResetOnChange(true);
        }
    }, [data.idStaff]);

    useEffect(() => {
        if (locked) {
            updateLockedData()
        }
    }, [data.salary, data.extraDays]);

    useEffect(() => {
        const total = calculateTotal();
        setData(prevData => ({ ...prevData, 
            total: Number.isNaN(total) ? 0 : total
        }))
    }, [data.salary, data.overtimePay, data.sfs, data.afp, data.loans, data.other]);

    const calculateTotal = () => {
        return parseFloat((Number(data.salary) + Number(data.overtimePay) - Number(data.sfs)
        - Number(data.afp) - Number(data.loans) - Number(data.other)).toFixed(2));
    };

    const updateLockedData = () => {
        const salary = Number.isNaN(parseFloat(data.salary)) ? 0 : parseFloat(data.salary)
        const extraDays = Number.isNaN(Number(data.extraDays)) ? 0 : Number(data.extraDays)
        setData(prevData => ({ ...prevData, 
            sfs: (salary * (3.04 / 100)).toFixed(2),
            afp: (salary * (2.78 / 100)).toFixed(2),
            overtimePay: ((salary / 23.83) * extraDays).toFixed(2) 
        }))
    }
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setProcessing(true)

        if (Number.isNaN(data.idNomina) || Number(data.idNomina) === 0) {
            setError("Debe seleccionar una nomina para continuar");
        } else if (Number.isNaN(data.idStaff) || Number(data.idStaff) === 0) {
            setError("Debe seleccionar una empleado para continuar");
        } else if (data.total < 0) {
            setError("El total no puede ser negativo");
        } else {
            const found = nominas.find(nomina => nomina.id.toString() === data.idNomina);
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
                deleted: 'false',
            };

            let exists: boolean = false;
            let deleted: boolean = true;

            if (!editMode) {
                try {
                    const validate = await fetch(`https://sayaserver.onrender.com/api/detailNomina/validate/${stringifiedData.idNomina}/${stringifiedData.idStaff}`, {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "x-api-key": "123456",
                        },
                    });

                    const json = await validate.json();

                    if (json.code.toString() === '200' && json.response == null) {
                        exists = false;
                        deleted = false;
                    } else if (json.code.toString() === '201' && json.response) {
                        if (json.response.deleted) {
                            exists = true;
                            deleted = true;
                        } else {
                            exists = true;
                            deleted = false;
                            setError("Ya existe un detalle de nómina para esta nómina y empleado")
                        }
                    } else {
                        console.log(json);
                        toast({
                            title: `Error`,
                            description: `Hubo un error al intentar crear la nómina`,
                            status: 'error',
                            position: 'bottom-right',
                            duration: 4000,
                            isClosable: true,
                        })
                        setProcessing(false);
                        return
                    }

                } catch {
                    console.log(error);
                    toast({
                        title: `Error`,
                        description: `Hubo un error al intentar crear la nómina`,
                        status: 'error',
                        position: 'bottom-right',
                        duration: 4000,
                        isClosable: true,
                    })
                    setProcessing(false);
                    return
                }
            }

            if (!editMode && !exists && !deleted) {
                try {
                    const res = await fetch('https://sayaserver.onrender.com/api/detailNomina', {
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
                            setters.reloadData(true);
                            setters.reloadYear(DateTime.fromISO(dateFound).toFormat('yyyy'));
                        } else {
                            setters.remoteSearchId(data.idNomina.toString());
                        }
                    } else {
                        console.log(data)
                        console.log(json)
                        toast({
                            title: `Error`,
                            description: `Hubo un error al intentar crear el detalle de nomina`,
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
                        description: `Hubo un error al intentar crear el detalle de nomina`,
                        status: 'error',
                        position: 'bottom-right',
                        duration: 4000,
                        isClosable: true,
                    })
                } finally {
                    setProcessing(false)
                }

            } else if (editMode || (exists && deleted) ) {
                try {
                    const res = await fetch(`https://sayaserver.onrender.com/api/detailNomina/${stringifiedData.idNomina}/${stringifiedData.idStaff}`, {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json",
                            "x-api-key": "123456",
                        },
                        body: JSON.stringify(stringifiedData),
                    });
                    const json = await res.json();

                    if (json.code.toString() === '200') {
                        toast({
                            title: `Detalle de nomina editado correctamente`,
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
                            setters.reloadData(true);
                            setters.reloadYear(DateTime.fromISO(dateFound).toFormat('yyyy'));
                        } else {
                            setters.remoteSearchId(data.idNomina.toString());
                        }
                    } else {
                        console.log(data)
                        console.log(json)
                        toast({
                            title: `Error`,
                            description: `Hubo un error al intentar crear el detalle de nomina`,
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
                        description: `Hubo un error al intentar crear el detalle de nomina`,
                        status: 'error',
                        position: 'bottom-right',
                        duration: 4000,
                        isClosable: true,
                    })
                } finally {
                    setProcessing(false)
                }
            }
        }
        setProcessing(false);
    };

    const handleExit = () => {
        setters.setEditMode(false);
        setters.setEditData({
            idNomina: '0',
            idStaff: '0',
            date: "",
            salary: '0',
            extraDays: '0',
            overtimePay: '0',
            sfs: '0',
            afp: '0',
            loans: '0',
            other: '0',
            total: 0,
        })
    };

    const [deleteOpen, setDeleteOpen] = useState(false);
    const onDeleteClose = () => setDeleteOpen(false);
    const cancelRef = useRef<HTMLButtonElement | null>(null);
  
    const handleDelete = async () => {
        setProcessing(true);
        try {
            const res = await fetch(`https://sayaserver.onrender.com/api/detailNomina/${data.idNomina}/${data.idStaff}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                }
            });
            const json = await res.json();

            if (json.code.toString() === '200') {
                toast({
                    title: `Detalle de nómina eliminado`,
                    description: `Se elimino correctamente el detalle para ${getStaffName()} (${DateTime.fromISO(data.date)
                                    .setLocale('es')
                                    .toFormat('MMMM dd, yyyy')})`,
                    status: 'success',
                    position: 'bottom-right',
                    duration: 4000,
                    isClosable: true,
                })

                onClose();

                if (id || staffId) {
                    setters.reloadData(true);
                    setters.reloadYear(DateTime.fromISO(getDate()).toFormat('yyyy'));
                } else {
                    setters.remoteSearchId(editData.idNomina.toString());
                }

            } else {
                toast({
                    title: `Error`,
                    description: `Ocurrio un error al intentar eliminar el detalle de nómina`,
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
                description: `Ocurrio un error al intentar eliminar el detalle de nómina`,
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

    return (
        <Modal onClose={onClose} size="full" isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent maxW={'1000px'} minH={'48vh'} alignSelf={'center'} borderRadius={8} p={8}>
                <ModalHeader textAlign={'center'}>{editMode ? 'Editar Detalle Nómina' : 'Nuevo Detalle Nómina'}</ModalHeader>
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
                            <FormControl isDisabled={editMode}>
                                <FormLabel>Nomina</FormLabel>
                                <SearchSelect disabled={editMode} placeholder='Selecciona una nomina' value={data.idNomina}
                                    onChange={(value) => 
                                        setData(prevData => ({ ...prevData, idNomina: value.toString() }))
                                    }>
                                    {nominas.map(item => (
                                        <SearchSelectItem key={item.id.toString()} value={item.id.toString()} >
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

                            <FormControl isDisabled={editMode}>
                                <FormLabel>Empleado</FormLabel>
                                <SearchSelect disabled={editMode} placeholder='Selecciona una empleado' value={data.idStaff}
                                    onChange={(value) => setData(prevData => ({ ...prevData, idStaff: value.toString() }))}>
                                    {staff.map(item => (
                                        <SearchSelectItem key={item.id.toString()} value={item.id.toString()}>
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
                            <Button w={'25%'} size='sm' variant={'outline'} 
                                isDisabled={staffButtonDisable || loading || processing} 
                                onClick={handleLoadStaffData}
                            >
                                Cargar datos de empleado
                            </Button>

                            <IconButton opacity={0.7} bg={'transparent'} aria-label='Unlock' icon={locked ? <LockIcon /> : <UnlockIcon />} 
                            onClick={() => {
                                if (!locked) {
                                    updateLockedData()
                                }
                                setLocked(!locked);
                            } }/>
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
                                    value={data.overtimePay} 
                                    onChange={(value) => setData({ ...data, overtimePay: value })}>
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
                        
                        {/* Submit and Delete Buttons */}
                        <Box display={'flex'} flexDirection={'row'} gap={3} mt={4} alignItems={'center'}>

                        <Button isDisabled={loading || !connected || processing } type="submit" colorScheme="teal">{editMode ? 'Editar' : 'Crear'}</Button>
                       
                        {editMode && (
                            <Button isDisabled={loading || !connected || processing } colorScheme='red' bg={'#C44D4D'} color={'white'} onClick={() => setDeleteOpen(true)}>Eliminar</Button>
                        )}

                        {processing && <Box ml={3} h={'25px'} w={'25px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                            <Spinner w={'100%'} h={'100%'} color='teal' size='x1' thickness='2px' />
                        </Box>}
                        </Box>

                        {/* Delete Confirmation */}
                        {editMode && (
                            <AlertDialog isOpen={deleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
                                <AlertDialogOverlay>
                                <AlertDialogContent alignSelf={'center'}>
                                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                    Confirmar Eliminación
                                    </AlertDialogHeader>

                                    <AlertDialogBody>
                                        <Text>¿Estás seguro de que deseas eliminar este detalle de nómina?</Text>
                                        <Card mt={3} variant={'outline'} bg={'#f9fbfd'} p={4} display={'flex'} gap={3} fontWeight={600} opacity={0.7}>
                                            <Text>ID Nómina: #{editData.idNomina}</Text>
                                            <Text>Empleado: {getStaffName()}</Text>
                                            <Text>Fecha: {DateTime.fromISO(getDate())
                                                    .setLocale('es')
                                                    .toFormat('MMMM dd, yyyy')
                                                    .replace(/^\w/, firstChar => firstChar.toUpperCase())}
                                            </Text>
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
                        )}
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
