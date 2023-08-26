import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, FormControl, FormLabel, Input, Card, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';

interface CreateNominaProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateNomina({ isOpen, onClose }: CreateNominaProps) {
    const router = useRouter();

    const [date, setDate] = useState('');
    const [dateError, setDateError] = useState('');

    const [type, setType] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (!isOpen) {
            setDate('');
            setType('');
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
        
        if (date === '') {
            setDateError('Seleccione una fecha');
        } else {

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

                    onClose();
                    router.push(`/App/Nomina?id=${id}`);
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
            }
        }
    };

    return (
        <Modal onClose={onClose} size="full" isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent maxW={'30vw'} minH={'48vh'} alignSelf={'center'} borderRadius={8} p={8}>
                <ModalHeader textAlign={'center'}>Nueva Nomina</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit} autoComplete='off'>
                        <Card variant={'outline'} display={'flex'} flexDirection={'column'} borderRadius={8} p={4} >
                            <FormControl>
                                <FormLabel>Fecha</FormLabel>
                                <Input
                                    
                                    type="date"
                                    value={date}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                />
                                {dateError && <p style={{ color: '#C44D4D' }}>{dateError}</p>}
                            </FormControl>

                            <FormControl mt={4}>
                                <FormLabel>Tipo</FormLabel>
                                <Input readOnly type="select" value={type} />
                            </FormControl>
                        </Card>

                        <Button type="submit" mt={4} colorScheme="teal">Crear</Button>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
