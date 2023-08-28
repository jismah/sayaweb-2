import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, FormControl, FormLabel, Input, Card, useToast, Box, Spinner, Select, Textarea } from '@chakra-ui/react';

interface CreateNominaProps {
    isOpen: boolean;
    onClose: () => void;
    idNomina: string;
}

export default function CreateNomina({ isOpen, onClose, idNomina}: CreateNominaProps) {

    const [processing, setProcessing] = useState(false);
    const [gotResult, setGotResult] = useState(false);
    const [AchDoc, setDocument] = useState('');
    const [nominaDate, setNominaDate] = useState('');

    const [type, setType] = useState('CA');
    const [currency, setCurrency] = useState('DOP');
    const [accountNumber, setAccountNumber] = useState('');

    const [error, setError] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (!isOpen) {
            setCurrency('DOP');
            setType('CA');
            setAccountNumber('');
            setGotResult(false);
            setError('');
        }
    }, [isOpen]);

    const handleDownload = () => {
        setProcessing(true);

        const blob = new Blob([AchDoc], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Nomina Saya #${idNomina} (${nominaDate}).txt`;
        a.click();
        URL.revokeObjectURL(url);

        setProcessing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setError('');
        
        if (accountNumber === '') {
            setError('Escriba un número de cuenta');
        } else {

            try {
                const res = await fetch('https://sayaserver.onrender.com/api/nomina/doc', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": "123456",
                    },
                    body: JSON.stringify({
                        idNomina: idNomina,
                        accountType: type.toString(),
                        accountCurrency: currency.toString(),
                        accountNumber: accountNumber.toString()
                    }),
                });
                const json = await res.json();

                if (json.code.toString() === '200') {
                    setDocument(json.response.document);
                    setNominaDate(json.response.date);
                    setGotResult(true);

                    toast({
                        title: `Documento ACH generado`,
                        description: `Se genero el documento ACH para la nomina #${idNomina}`,
                        status: 'success',
                        position: 'bottom-right',
                        duration: 4000,
                        isClosable: true,
                    })
                } else {
                    console.log(json)
                    toast({
                        title: `Error`,
                        description: `Ocurrio un error al intentar crear el documento`,
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
                    description: `Ocurrio un error al intentar crear el documento`,
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

    return (
        <Modal onClose={onClose} size="full" isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent maxW={gotResult ? '70vw' : '30vw'} minH={'48vh'} alignSelf={'center'} borderRadius={8} p={8}>
                <ModalHeader textAlign={'center'}>Documento ACH</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {(!gotResult &&
                    <form onSubmit={handleSubmit} autoComplete='on'>
                        <Card variant={'outline'} display={'flex'} flexDirection={'column'} borderRadius={8} p={4} gap={4}>

                            <FormControl>
                                <FormLabel>ID Nómina</FormLabel>
                                <Input isDisabled={true} readOnly type="text" value={idNomina} />
                            </FormControl>

                            <FormControl>
                                <FormLabel>Número de cuenta</FormLabel>
                                    <Input
                                        type='number'
                                        min={0}
                                        value={accountNumber}
                                        onChange={(e) => setAccountNumber(e.target.value)}
                                    />
                            </FormControl>

                            <Box display={'flex'} w={'100%'} flexDirection={'row'} gap={4}>
                                <FormControl>
                                    <FormLabel>Tipo</FormLabel>
                                    <Select value={type} onChange={(event) => { setType(event.target.value) }}>
                                        <option value='CA'>CA</option>
                                        <option value='CC'>CC</option>
                                        <option value='CD'>CD</option>
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Moneda</FormLabel>
                                    <Select value={currency} onChange={(event) => { setCurrency(event.target.value) }}>
                                        <option value='DOP'>DOP</option>
                                        <option disabled value='USD'>USD</option>
                                        <option disabled value='EUR'>EUR</option>
                                    </Select>
                                </FormControl>
                            </Box>
                            {error && <p style={{ color: '#C44D4D' }}>{error}</p>}
                        </Card>
                        
                        <Box display={'flex'} flexDirection={'row'} gap={3} mt={4} alignItems={'center'}>
                            <Button type="submit" colorScheme="teal">Generar Documento</Button>

                            {processing && <Box ml={3} h={'25px'} w={'25px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Spinner w={'100%'} h={'100%'} color='teal' size='x1' thickness='2px' />
                            </Box>}
                        </Box>
                    </form>
                    )}

                    {/* Doc Result */}
                    {gotResult && (<Box>
                        <Card variant={'ghost'} style={{ display: 'flex', flexDirection: 'column', maxHeight: '70vh' }}>
                            <Textarea
                                borderColor={'#cbd5e0'}
                                borderRadius={8}
                                style={{ flex: 1, height: 'auto', minHeight: '30vh', maxHeight: '70vh' }}
                                readOnly
                                resize={'none'}
                                value={AchDoc == '' ? "Esta nómina esta vacia" : AchDoc}
                                textAlign={AchDoc == '' ? 'center' : 'left'}
                                color={AchDoc == '' ? '#C44D4D' : '#000'}
                            />
                        </Card>


                        <Box display={'flex'} flexDirection={'row'} gap={3} mt={4} alignItems={'center'}>
                            <Button isDisabled={AchDoc == ''} onClick={handleDownload} colorScheme="teal">Descargar</Button>

                            {processing && <Box ml={3} h={'25px'} w={'25px'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                <Spinner w={'100%'} h={'100%'} color='teal' size='x1' thickness='2px' />
                            </Box>}
                        </Box>
                    </Box>)}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
