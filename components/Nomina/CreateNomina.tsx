import React, { useEffect, useRef, useState } from 'react';
import { Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, FormControl, FormLabel, Input, Card, useToast, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';

interface CreateNominaProps {
    isOpen: boolean;
    onClose: () => void;
    editMode: boolean;
    data: {
        idNomina: string;
        date: string;
    };
    setters: {
        setEditMode: (arg0: boolean) => void,
        setEditData: ({idNomina, date}: {idNomina: string, date: string}) => void,
        remoteSearch: (arg0: string) => void,
        setRemoteYear: (arg0: string) => void
    }
}

export default function CreateNomina({ isOpen, onClose, editMode, data, setters}: CreateNominaProps) {

    const [processing, setProcessing] = useState(false);

    const [date, setDate] = useState('');
    const [dateError, setDateError] = useState('');

    const [type, setType] = useState('');
    const toast = useToast();

    const [deleteOpen, setDeleteOpen] = useState(false);
    const onDeleteClose = () => setDeleteOpen(false);
    const cancelRef = useRef<HTMLButtonElement | null>(null);
  
    const handleDelete = async () => {
        setProcessing(true);
        try {
            const res = await fetch(`http://localhost:3000/api/nomina/${data.idNomina}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                }
            });
            const json = await res.json();

            if (json.code.toString() === '200') {
                toast({
                    title: `Nomina #${data.idNomina} eliminada`,
                    description: `Se elimino correctamente la nomina para ${DateTime.fromISO(data.date)
                                    .setLocale('es')
                                    .toFormat('MMMM dd, yyyy')}`,
                    status: 'success',
                    position: 'bottom-right',
                    duration: 4000,
                    isClosable: true,
                })

                setters.setRemoteYear(DateTime.fromISO(data.date).toFormat('yyyy'))
                onClose();
            } else {
                toast({
                    title: `Error`,
                    description: `Ocurrio un error al intentar eliminar la nomina con ID #${data.idNomina}`,
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
                description: `Ocurrio un error al intentar eliminar la nomina con ID #${data.idNomina}`,
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

    useEffect(() => {
        if (!isOpen) {
            setDate('');
            setType('');
            handleExit();
        } else {
            if (editMode && data) {
                handleDateChange(data.date)
            }
        }
    }, [isOpen]);

    const handleDateChange = (newDate: string) => {
        setDate(newDate);
        setDateError('');

        if (newDate.endsWith('15')) {
            setType('Quincenal');
        } else if (newDate.endsWith('28') || newDate.endsWith('30')) {
            setType('Mensual');
        } else {
            setType('');
        }
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        
        if (date === '') {
            setDateError('Seleccione una fecha');
        } else if (type === '') {
            setDateError('Seleccione una fecha válida para nóminas');
        } else if (!editMode) {

            try {
                const res = await fetch('http://localhost:3000/api/nomina', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "123456",
                    },
                    body: JSON.stringify({
                        date,
                        type,
                    }),
                });
                const json = await res.json();
                const id = await json.response.id

                if (json.code.toString() === '200') {
                    toast({
                        title: `Nomina #${id} creada`,
                        description: `Se creo una correctamente una nomina con ID #${id}`,
                        status: 'success',
                        position: 'bottom-right',
                        duration: 4000,
                        isClosable: true,
                    })
                    
                    setters.remoteSearch(id.toString())
                    onClose();
                } else {
                    toast({
                        title: `Error`,
                        description: `Ocurrio un error al intentar crear una nomina con ID #${id}`,
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
                    description: `Ocurrio un error al intentar crear una nomina`,
                    status: 'error',
                    position: 'bottom-right',
                    duration: 4000,
                    isClosable: true,
                })
            } finally {
                setProcessing(false);
            }

        } else if (editMode) {

            try {
                const res = await fetch(`http://localhost:3000/api/nomina/${data.idNomina}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "123456",
                    },
                    body: JSON.stringify({
                        date,
                        type,
                    }),
                });
                const json = await res.json();

                if (json.code.toString() === '200') {
                    toast({
                        title: `Nomina #${data.idNomina} modificada`,
                        description: `Se cambio a para ${DateTime.fromISO(date)
                                        .setLocale('es')
                                        .toFormat('MMMM dd, yyyy')}`,
                        status: 'success',
                        position: 'bottom-right',
                        duration: 4000,
                        isClosable: true,
                    })

                    setters.remoteSearch(data.idNomina.toString())
                    onClose();
                } else {
                    toast({
                        title: `Error`,
                        description: `Ocurrio un error al intentar editar la nomina con ID #${data.idNomina}`,
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
                    description: `Ocurrio un error al intentar editar la nomina con ID #${data.idNomina}`,
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

    const handleExit = () => {
        setters.setEditMode(false);
        setters.setEditData({idNomina: '', date: ''})
    };

    return (
        <Modal onClose={onClose} size="full" isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent maxW={'30vw'} minH={'48vh'} alignSelf={'center'} borderRadius={8} p={8}>
                <ModalHeader textAlign={'center'}>{editMode ? 'Editar Nómina' : 'Nueva Nómina'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit} autoComplete='off'>
                        <Card variant={'outline'} display={'flex'} flexDirection={'column'} borderRadius={8} p={4} gap={4}>

                            {editMode && data.idNomina && (
                                <FormControl>
                                    <FormLabel>ID Nómina</FormLabel>
                                    <Input isDisabled={true} readOnly type="text" value={data.idNomina} />
                                </FormControl>
                            )}

                            <FormControl>
                                <FormLabel>Fecha</FormLabel>
                                <Input
                                    isInvalid={dateError != ''}
                                    type="date"
                                    value={date}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    
                                />
                                {dateError && <p style={{ color: '#C44D4D' }}>{dateError}</p>}
                            </FormControl>

                            <FormControl>
                                <FormLabel>Tipo</FormLabel>
                                <Input readOnly type="select" value={type} />
                            </FormControl>
                        </Card>
                        
                        {/* Submit and Delete Buttons */}
                        <Box display={'flex'} flexDirection={'row'} gap={3} mt={4} alignItems={'center'}>
                            <Button type="submit" colorScheme="teal">{ editMode ? 'Editar' : 'Crear'}</Button>

                            {editMode && (
                                <Button colorScheme='red' bg={'#C44D4D'} color={'white'} onClick={() => setDeleteOpen(true)}>Eliminar</Button>
                            )}

                            {processing && <Box ml={3} h={'25px'} w={'25px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Spinner w={'100%'} h={'100%'} color='teal' size='x1' thickness='2px' />
                            </Box>}
                        </Box>

                        {/* Deletion confirmation */}
                        {editMode && (
                            <AlertDialog isOpen={deleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
                                <AlertDialogOverlay>
                                <AlertDialogContent alignSelf={'center'}>
                                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                    Confirmar Eliminación
                                    </AlertDialogHeader>

                                    <AlertDialogBody>
                                        <Text>¿Estás seguro de que deseas eliminar esta nómina?</Text>
                                        <Card mt={3} variant={'outline'} bg={'#f9fbfd'} p={4} display={'flex'} gap={3} fontWeight={600} opacity={0.7}>
                                            <Text>ID: #{data.idNomina}</Text>
                                            <Text>Fecha: {DateTime.fromISO(data.date)
                                                    .setLocale('es')
                                                    .toFormat('MMMM dd, yyyy')
                                                    .replace(/^\w/, firstChar => firstChar.toUpperCase())
                                            }</Text>
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
