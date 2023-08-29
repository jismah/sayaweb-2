import { AddIcon, ArrowForwardIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, Card, CardBody, CardHeader, Flex, FormControl, FormLabel, SimpleGrid, HStack, Heading, Input, Radio, RadioGroup, Select, Stack, Text, useToast, NumberInput, NumberInputField, NumberDecrementStepper, NumberIncrementStepper, NumberInputStepper, Table, TableContainer, Tbody, Td, Th, Thead, Tr, ButtonGroup, IconButton, Spinner } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';


import { Student } from '../../Students/Students/Students';
  
import { Parent } from '../../Students/Parents/Parents';

import { Pediatrician } from "../../Students/Pediatricians/Pediatricians";
import { EmergencyContact } from "../../Students/EmergencyContacts/EmergencyContacts";
import { Tutor } from "../../Students/Tutors/Tutor";

import { City } from "../../Students/Cities/Cities";
import { Program } from "../../StudentProgram/Programs/Programs";

export default function StudentForm({dataParents, dataStudent, editingMode, createStudentWithFamily} : {dataParents : Parent[]; dataStudent : Student; editingMode : boolean; createStudentWithFamily : boolean}) {
    const [loading, setLoading] = useState(false);

    const [dataStudentLocal, setDataStudentLocal] = useState<Student>({
        ...dataStudent,
    });
    
    const initialParentData: Parent = {
        id: "",
        identityCard: "",
        name: "",
        lastName1: "",
        lastName2: "",
        telephone: "",
        email: "",
        occupation: "",
        idFamily: "",
    };

    const initialStudentData: Student = {
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
        idFamily: "", 
        idParent: "",
      };

    const initialTutorData: Tutor = {
        id: "",
        name: "",
        occupation: "",
        phone: "",
        idStudent: "",
    };
    
    const initialEmergencyContactData: EmergencyContact = {
        id: "",
        name: "",
        phone: "",
        idStudent: "",
    };

    const initialPediatricianData: Pediatrician = {
        id: "",
        name: "",
        medicalInstitution: "",
        officeNumber: "",
        phone: "",
    }
    


    const initialCityData: City = {
        id: "",
        name: "",
    };
    

    const [emergencyContactList, setEmergencyContactList] = useState<EmergencyContact[]>([]);
    const [tutorList, setTutorList] = useState<Tutor[]>([]);
    const [parentList, setParentList] = useState<Parent[]>([]);

    const [dataEmergencyContacts, setDataEmergencyContacts] = useState<EmergencyContact[]>([]);
    const [dataTutors, setDataTutors] = useState<Tutor[]>([]);
    const [dataCities, setDataCities] = useState<City[]>([]);
    const [dataPrograms, setDataPrograms] = useState<Program[]>([]);

    // Estado para el índice en edición
    const [editingParentIndex, setEditingParentIndex] = useState<number | null>(null);
    const [editingTutorIndex, setEditingTutorIndex] = useState<number | null>(null);
    const [editingEmergencyContactIndex, setEditingEmergencyContactIndex] = useState<number | null>(null);
    const [selectedCityId, setSelectedCityId] = useState<string | undefined>(dataStudentLocal.idCity);
    const [selectedProgramId, setSelectedProgramId] = useState<string | undefined>(dataStudentLocal.idProgram);


    const [dataParentLocal, setDataParentLocal] = useState<Parent>(initialParentData);
    const [dataEmergencyContact, setDataEmergencyContact] = useState<EmergencyContact>(initialEmergencyContactData);
    const [dataTutor, setDataTutor] = useState<Tutor>(initialTutorData);
    const [dataPediatrician, setDataPediatrician] = useState<Pediatrician>(initialPediatricianData);
    

    const toast = useToast();
    


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

    
        const requestBody = {
            student: {
                name: dataStudentLocal.name.toString(),
                lastName1: dataStudentLocal.lastName1.toString(),
                lastName2: dataStudentLocal?.lastName2?.toString(),
                dateBirth: dataStudentLocal.dateBirth.toString(),
                housePhone: dataStudentLocal.housePhone.toString(),
                address: dataStudentLocal.address.toString(),
                status: dataStudentLocal.status.toString(),
                commentary: dataStudentLocal?.commentary?.toString(),
                medicalCondition: dataStudentLocal.medicalCondition?.toString(),
                progressDesired: dataStudentLocal.progressDesired?.toString(),
                allowedPictures: dataStudentLocal.allowedPictures.toString(),
                idCity: selectedCityId?.toString(),
                idProgram: selectedProgramId?.toString(),
            },
            pediatrician: {
                name: dataPediatrician.name.toString(),
                medicalInstitution: dataPediatrician.medicalInstitution.toString(),
                officeNumber: dataPediatrician.officeNumber.toString(),
                phone: dataPediatrician.phone.toString(),
            },
            parents: parentList.map(parent => ({
                identityCard: parent.identityCard.toString(),
                name: parent.name.toString(),
                lastName1: parent.lastName1.toString(),
                lastName2: parent.lastName2?.toString(),
                telephone: parent.telephone.toString(),
                email: parent.email.toString(),
                occupation: parent.occupation?.toString(),
            })),
            emergencyContacts: emergencyContactList.map(contact => ({
                name: contact.name.toString(),
                phone: contact.phone.toString(),
            })),
            tutors: tutorList.map(tutor => ({
                name: tutor.name.toString(),
                occupation: tutor.occupation?.toString(),
                phone: tutor.phone.toString(),
            })),
        };
    
        console.log('Request Body:', JSON.stringify(requestBody));
    
        try {
            const response = await fetch('https://sayaserver.onrender.com/api/inscription/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
                body: JSON.stringify(requestBody),
            });
    
            const jsonResponse = await response.json();
            console.log('Response:', jsonResponse);
    
            toast({
                title: 'Registro Creado!',
                description: "Se creo el registro correctamente.",
                status: 'success',
                position: 'bottom-right',
                duration: 4000,
                isClosable: true,
            });

            setDataStudentLocal(initialStudentData);
            setDataEmergencyContact(initialEmergencyContactData);
            setDataParentLocal(initialParentData);
            setDataTutor(initialTutorData);
            setDataPediatrician(initialPediatricianData);
            setParentList([]);
            setTutorList([]);
            setEmergencyContactList([]);
            setSelectedCityId("");
            setSelectedProgramId("");
            
        } catch (error) {
            console.error(error);
        } 
    };
    
    
    const fetchStudentsRelations = async () => {
        try {
            const response = await fetch(`https://sayaserver.onrender.com/api/students/relations/${dataStudentLocal.id}`, {
                method: 'GET',
                headers: {
                "Content-Type": "application/json",
                "x-api-key": "123456",
                },
            });
            const jsonData = await response.json();
            console.log(jsonData);

            if(jsonData.response){
                const {tutors, emergencyContacts, pediatrician } = jsonData.response;
                setDataTutors(tutors);
                setDataEmergencyContacts(emergencyContacts);
                setDataPediatrician(pediatrician);
            }
        
        } catch (error) {
            console.error(error);
            // MANEJO DE ERRORES
        } 
    
    }

    const fetchSelects = async () => {
        setLoading(true);
        try {
            const citiesResponse = await fetch('https://sayaserver.onrender.com/api/cities', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
            });
            const jsonCities = await citiesResponse.json();
            console.log(jsonCities);

            setDataCities(jsonCities.response); // Guarda las ciudades en el estado dataCities

            const programsResponse = await fetch('https://sayaserver.onrender.com/api/programs', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": "123456",
                },
            });
            const jsonPrograms = await programsResponse.json();
            console.log(jsonPrograms);

            setDataPrograms(jsonPrograms.response); // Guarda las ciudades en el estado dataCities

        } catch (error) {
            console.error(error);
            // MANEJO DE ERRORES
        }finally{
            setLoading(false);
        }
    };
   
    useEffect(() => {
        setLoading(true);
        if(editingMode){
            fetchStudentsRelations();
        }
        fetchSelects();

        if(editingMode){
            if (dataParents.length > 0) {
                setDataParentLocal(dataParents[0]);
                setParentList(dataParents);
            }
    
            if (dataTutors.length > 0) {
                setDataTutor(dataTutors[0]);
                setTutorList(dataTutors);
            }
    
            if (dataEmergencyContacts.length > 0) {
                setDataEmergencyContact(dataEmergencyContacts[0]);
                setEmergencyContactList(dataEmergencyContacts);
            }
        
             // Configurar el estado de selectedCityId
            setSelectedCityId(dataStudentLocal.idCity);
    
             // Configurar el estado de selectedProgramId
            setSelectedProgramId(dataStudentLocal.idProgram);
        }else{
            if( createStudentWithFamily){
                if (dataParents.length > 0) {
                    setDataParentLocal(dataParents[0]);
                    setParentList(dataParents);
                }
            }
        }
        
        
    }, [editingMode, dataParents, dataTutors, dataEmergencyContacts, dataStudentLocal.idCity, dataStudentLocal.idProgram]);
   

    //Manejo de listado de padres
        const handleAddParent = () => {
            // Agregar padre a la lista sin limpiar los campos del form
            setParentList([...parentList, dataParentLocal]);
        }
        
        const handleAddParentAndClear = () => {
            const isDuplicate = parentList.some(parent => parent.identityCard === dataParentLocal.identityCard);
        
            if (isDuplicate) {
                console.log("Este padre ya ha sido agregado.");
            } else {
                // Agregar padre a la lista y limpiar los campos del form
                handleAddParent();
                setDataParentLocal(initialParentData);
            }
        }

        const handleEditParent = (index: number) => {
            setEditingParentIndex(index);
            setDataParentLocal(parentList[index]);
        };
        
        const handleDeleteParent = (index: number) => {
            // Elimina el padre de la lista local utilizando index
            const updatedList = [...parentList];
            updatedList.splice(index, 1);
            setParentList(updatedList);
        };



    

    //Manejo de listado de tutores
        const handleAddTutor = () => {
            // Agregar tutor a la lista sin limpiar los campos del form
            setTutorList([...tutorList, dataTutor]);
        }
        
        const handleAddTutorAndClear = () => {
            const isDuplicate = tutorList.some(tutor => tutor.idStudent === dataTutor.idStudent);
        
            if (isDuplicate) {
                console.log("Este tutor ya ha sido agregado.");
            } else {
                // Agregar tutor a la lista y limpiar los campos del form
                handleAddTutor();
                setDataTutor(initialTutorData);
            }
        }

        const handleEditTutor = (index: number) => {
            setEditingTutorIndex(index);
            setDataTutor(tutorList[index]);
        };
        
        const handleDeleteTutor = (index: number) => {
            // Elimina el padre de la lista local utilizando index
            const updatedList = [...tutorList];
            updatedList.splice(index, 1);
            setTutorList(updatedList);
        };

    //Manejo de listado de contactos de emergencia
        const handleAddEmergencyContact = () => {
            // Agregar contacto de emergencia a la lista sin limpiar los campos del form
            setEmergencyContactList([...emergencyContactList, dataEmergencyContact]);
        }
        
        const handleAddEmergencyContactAndClear = () => {
            const isDuplicate = emergencyContactList.some(contact => contact.idStudent === dataEmergencyContact.idStudent);
        
            if (isDuplicate) {
                console.log("Este contacto de emergencia ya ha sido agregado.");
            } else {
                // Agregar contacto de emergencia a la lista y limpiar los campos del form
                handleAddEmergencyContact();
                setDataEmergencyContact(initialEmergencyContactData);
            }
        }

        const handleEditEmergencyContact = (index: number) => {
            setEditingEmergencyContactIndex(index);
            setDataEmergencyContact(emergencyContactList[index]);
        };
        
        const handleDeleteEmergencyContact = (index: number) => {
            // Elimina el padre de la lista local utilizando index
            const updatedList = [...emergencyContactList];
            updatedList.splice(index, 1);
            setEmergencyContactList(updatedList);
        };
    


    return (
        <>
            <Flex justifyContent={'center'}>
                <Box px={3} py={3} >

                    <Heading mb={3}>Solicitud de Inscripción</Heading>
                    <Text pb={6}>Ingresa los datos sobre tu hijo/a</Text>
                    <Card variant={'outline'}>
                        <CardBody>
                            {loading ?
                                <Box height={'100'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                                    <Spinner color='teal' size='xl' thickness='3px' />
                                </Box>

                            : <form onSubmit={handleSubmit}>
                                    <Stack spacing={4}>
                                        <SimpleGrid columns={3} spacing={10}>
                                            <FormControl isRequired >
                                                <FormLabel>Nombre </FormLabel>
                                                <Input type='text' placeholder="Nombre" value={dataStudentLocal.name || ""}  onChange={(e)=> setDataStudentLocal({ ... dataStudentLocal, name: e.target.value})}/>
                                            </FormControl>

                                            <FormControl isRequired >
                                                <FormLabel>Primer apellido</FormLabel>
                                                <Input type='text' placeholder="Primer apellido" value={dataStudentLocal.lastName1 || ""}  onChange={(e)=> setDataStudentLocal({ ... dataStudentLocal, lastName1: e.target.value})} / > 
                                            </FormControl>

                                            <FormControl >
                                                <FormLabel>Segundo apellido</FormLabel>
                                                <Input type='text' placeholder="Segundo apellido" value={dataStudentLocal.lastName2 || ""}  onChange={(e)=> setDataStudentLocal({ ... dataStudentLocal, lastName2: e.target.value})} />
                                            </FormControl>
                                        </SimpleGrid>
                                        
                                        <SimpleGrid columns={2} spacing={10}>
                                            <FormControl>
                                                <FormLabel>Fecha de nacimiento</FormLabel>
                                                <Input
                                                placeholder="Fecha de nacimiento"
                                                size="md"
                                                type="date"
                                                value={dataStudentLocal.dateBirth || ""}  onChange={(e)=> setDataStudentLocal({ ... dataStudentLocal, dateBirth: e.target.value})} / >
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Número de teléfono de la casa</FormLabel>
                                                <Input type="tel" placeholder='(000)-000-0000' value={dataStudentLocal.housePhone || ""}  onChange={(e)=> setDataStudentLocal({ ... dataStudentLocal, housePhone: e.target.value})} />
                                            </FormControl>
                                        </SimpleGrid>
                                        

                                        <FormControl isRequired>
                                            <FormLabel>Dirección</FormLabel>
                                            <Input type="text" placeholder='Dirección del hogar' value={dataStudentLocal.address || ""}  onChange={(e)=> setDataStudentLocal({ ... dataStudentLocal, address: e.target.value})} />
                                        </FormControl>

                                        <SimpleGrid columns={2} spacing={10} mb={3}>
                                            <FormControl isRequired>
                                                <FormLabel>Ciudad</FormLabel>
                                                <Select value={selectedCityId} onChange={(e) => setSelectedCityId(e.target.value)} placeholder='Seleccionar ciudad'>
                                                    {dataCities.map(city => (
                                                        <option key={city.id} value={city.id}>
                                                            {city.name}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Programa</FormLabel>
                                                <Select value={selectedProgramId} onChange={(e) => setSelectedProgramId(e.target.value)} placeholder='Seleccionar programa'>
                                                    {dataPrograms.map(program => (
                                                        <option key={program.id} value={program.id}>
                                                            {program.   description}
                                                        </option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </SimpleGrid>
                                        

                                        <Card >
                                            <CardHeader>
                                                <Heading size='md'>Padre o madre</Heading>
                                            </CardHeader>
                                            
                                            <CardBody>
                                                <SimpleGrid columns={3} spacing={10} mb={3}>
                                                    <FormControl isRequired>
                                                        <FormLabel>Nombre</FormLabel>
                                                        <Input placeholder="Nombre" value={dataParentLocal.name || ""} type='text'  onChange={(e) => setDataParentLocal({ ...dataParentLocal, name: e.target.value })} />
                                                    </FormControl>

                                                    <FormControl isRequired>
                                                        <FormLabel>Primer apellido</FormLabel>
                                                        <Input placeholder="Primer apellido" value={dataParentLocal.lastName1 || ""} type='text'  onChange={(e) => setDataParentLocal({ ...dataParentLocal, lastName1: e.target.value })} />
                                                    </FormControl>

                                                    <FormControl>
                                                        <FormLabel>Segundo apellido</FormLabel>
                                                        <Input placeholder="Segundo apellido" value={dataParentLocal.lastName2 || ""} type='text'  onChange={(e) => setDataParentLocal({ ...dataParentLocal, lastName2: e.target.value })} />
                                                    </FormControl>
                                                </SimpleGrid>
                                            
                                                <SimpleGrid columns={2} spacing={10} mb={3}>
                                                    <FormControl isRequired>
                                                        <FormLabel>Cédula</FormLabel>
                                                        <Input placeholder="Cédula" value={dataParentLocal.identityCard || ""} type='text' onChange={(e) => setDataParentLocal({ ...dataParentLocal, identityCard: e.target.value })} />
                                                    </FormControl>

                                                    <FormControl isRequired>
                                                        <FormLabel>Correo electrónico</FormLabel>
                                                        <Input placeholder="Correo electrónico" value={dataParentLocal.email || ""} type='email'  onChange={(e) => setDataParentLocal({ ...dataParentLocal, email: e.target.value })} />
                                                    </FormControl>
                                                </SimpleGrid>
                                            
                                                <SimpleGrid columns={2} spacing={10} mb={3}>
                                                    <FormControl>
                                                        <FormLabel>Ocupación</FormLabel>
                                                        <Input placeholder="Ocupación" value={dataParentLocal.occupation || ""} type='text'  onChange={(e) => setDataParentLocal({ ...dataParentLocal, occupation: e.target.value })} />
                                                    </FormControl>

                                                    <FormControl>
                                                        <FormLabel>Número de teléfono</FormLabel>
                                                        <Input placeholder="Número de teléfono" value={dataParentLocal.telephone || ""} type='tel'  onChange={(e) => setDataParentLocal({ ...dataParentLocal, telephone: e.target.value })} />
                                                    </FormControl>
                                                </SimpleGrid>

                                                
                                                <Button onClick={handleAddParent} size='sm' leftIcon={<AddIcon />} variant={'solid'} color={'teal'} mt={3} mr={3}>
                                                    Agregar Padre
                                                </Button>

                                                <Button onClick={handleAddParentAndClear} size='sm' leftIcon={<AddIcon />} variant={'solid'} color={'teal'} mt={3}>
                                                    Entrar nuevo padre
                                                </Button>

                                                <Box pt={4}>
                                                    <FormLabel>Padres agregados</FormLabel>
                                                    <Card variant={'outline'}>
                                                        <CardBody p={0}>
                                                        <TableContainer>
                                                            <Table variant='striped'>
                                                            <Thead>
                                                                <Tr>
                                                                    <Th>Nombre Completo</Th>
                                                                    <Th>Cedula</Th>
                                                                    <Th>Teléfono</Th>
                                                                    <Th>Email</Th>
                                                                    <Th>Ocupación</Th>
                                                                    <Th>Acciones</Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {parentList.map((parent, index) => {
                                                                    return (
                                                                        <Tr key={parent.id}>
                                                                            <Td>{parent.name} {parent.lastName1} {parent.lastName2}</Td>
                                                                            <Td>{parent.identityCard}</Td>
                                                                            <Td>{parent.telephone}</Td>
                                                                            <Td>{parent.email}</Td>
                                                                            <Td>{parent.occupation}</Td>
                                                                            <Td>
                                                                                <ButtonGroup variant='ghost' spacing='1'>
                                                                                    <IconButton onClick={() => handleEditParent(index)} colorScheme='green' icon={<EditIcon />} aria-label='Edit'></IconButton>

                                                                                    <IconButton onClick={() => handleDeleteParent(index)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete'></IconButton>
                                                                                </ButtonGroup>
                                                                            </Td>
                                                                        </Tr>
                                                                    )
                                                                })
                                                                }
                                                            </Tbody>
                                                            </Table>
                                                        </TableContainer>
                                                        </CardBody>
                                                    </Card>
                                                </Box>

                                            </CardBody>
                                        </Card>

                                        
                                    

                                        <Card>
                                            <CardHeader>
                                                <Heading size='md'>Datos del tutor</Heading>
                                            </CardHeader>
                                            
                                            <CardBody>
                                                <FormControl isRequired>
                                                    <FormLabel>Nombre completo</FormLabel>
                                                    <Input placeholder='Nombre' value={dataTutor.name || ""} onChange={(e) => setDataTutor({ ...dataTutor, name: e.target.value })} />
                                                </FormControl>

                                                <FormControl>
                                                    <FormLabel>Ocupación</FormLabel>
                                                    <Input placeholder='Ocupación' value={dataTutor.occupation || ""} onChange={(e) => setDataTutor({ ...dataTutor, occupation: e.target.value })} />
                                                </FormControl>

                                                <FormControl isRequired>
                                                    <FormLabel>Número de teléfono</FormLabel>
                                                    <Input type="tel" placeholder='(000)-000-0000' value={dataTutor.phone || ""} onChange={(e) => setDataTutor({ ...dataTutor, phone: e.target.value })} />
                                                </FormControl>


                                                <Button onClick={handleAddTutor} size='sm' leftIcon={<AddIcon />} variant={'solid'} color={'teal'} mt={3} mr={3}>
                                                    Agregar Tutor
                                                </Button>

                                                <Button onClick={handleAddTutorAndClear} size='sm' leftIcon={<AddIcon />} variant={'solid'} color={'teal'} mt={3} >
                                                    Entrar nuevo tutor
                                                </Button>

                                                <Box pt={4}>
                                                    <FormLabel>Tutores agregados</FormLabel>
                                                    <Card variant={'outline'}>
                                                        <CardBody p={0}>
                                                        <TableContainer>
                                                            <Table variant='striped'>
                                                            <Thead>
                                                                <Tr>
                                                                    <Th>Nombre Completo</Th>
                                                                    <Th>Teléfono</Th>
                                                                    <Th>Ocupación</Th>
                                                                    <Th>Acciones</Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {tutorList.map((tutor, index) => {
                                                                    return (
                                                                        <Tr key={tutor.id}>
                                                                            <Td>{tutor.name}</Td>
                                                                            <Td>{tutor.phone}</Td>
                                                                            <Td>{tutor.occupation}</Td>
                                                                            <Td>
                                                                                <ButtonGroup variant='ghost' spacing='1'>
                                                                                    <IconButton onClick={() => handleEditTutor(index)} colorScheme='green' icon={<EditIcon />} aria-label='Edit'></IconButton>

                                                                                    <IconButton onClick={() => handleDeleteTutor(index)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete'></IconButton>
                                                                                </ButtonGroup>
                                                                            </Td>
                                                                        </Tr>
                                                                    )
                                                                })
                                                                }
                                                            </Tbody>
                                                            </Table>
                                                        </TableContainer>
                                                        </CardBody>
                                                    </Card>
                                                </Box>
                                            </CardBody>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <Heading size='md'>Datos del contacto de emergencia</Heading>
                                            </CardHeader>
                                            
                                            <CardBody>
                                                <FormControl isRequired>
                                                    <FormLabel>Nombre completo</FormLabel>
                                                    <Input placeholder='Nombre' value={dataEmergencyContact.name || ""} onChange={(e) => setDataEmergencyContact({ ...dataEmergencyContact, name: e.target.value })} />
                                                </FormControl>

                                                <FormControl isRequired>
                                                    <FormLabel>Número de telefono</FormLabel>
                                                    <Input type="tel" placeholder='(000)-000-0000' value={dataEmergencyContact.phone || ""} onChange={(e) => setDataEmergencyContact({ ...dataEmergencyContact, phone: e.target.value })} />
                                                </FormControl>

                                                <Button onClick={handleAddEmergencyContact} size='sm' leftIcon={<AddIcon />} variant={'solid'} color={'teal'} mt={3} mr={3}>
                                                    Agregar Contacto de Emergencia
                                                </Button>

                                                <Button onClick={handleAddEmergencyContactAndClear} size='sm' leftIcon={<AddIcon />} variant={'solid'} color={'teal'} mt={3}>
                                                    Entrar nuevo Contacto de Emergencia
                                                </Button>

                                                <Box pt={4}>
                                                    <FormLabel>Contactos de emergencia agregados</FormLabel>
                                                    <Card variant={'outline'}>
                                                        <CardBody p={0}>
                                                        <TableContainer>
                                                            <Table variant='striped'>
                                                            <Thead>
                                                                <Tr>
                                                                    <Th>Nombre Completo</Th>
                                                                    <Th>Teléfono</Th>
                                                                    <Th>Acciones</Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {emergencyContactList.map((emergencyContact, index) => {
                                                                    return (
                                                                        <Tr key={emergencyContact.id}>
                                                                            <Td>{emergencyContact.name}</Td>
                                                                            <Td>{emergencyContact.phone}</Td>
                                                                            <Td>
                                                                                <ButtonGroup variant='ghost' spacing='1'>
                                                                                    <IconButton onClick={() => handleEditEmergencyContact(index)} colorScheme='green' icon={<EditIcon />} aria-label='Edit'></IconButton>

                                                                                    <IconButton onClick={() => handleDeleteEmergencyContact(index)} icon={<DeleteIcon />} colorScheme='red' aria-label='Delete'></IconButton>
                                                                                </ButtonGroup>
                                                                            </Td>
                                                                        </Tr>
                                                                    )
                                                                })
                                                                }
                                                            </Tbody>
                                                            </Table>
                                                        </TableContainer>
                                                        </CardBody>
                                                    </Card>
                                                </Box>
                                            </CardBody>
                                        </Card>
                                        
                                        <Card>
                                            <CardHeader>
                                                <Heading size='md'>Datos del pediatra</Heading>
                                            </CardHeader>
                                            
                                            <CardBody>
                                                <FormControl isRequired>
                                                    <FormLabel>Nombre completo</FormLabel>
                                                    <Input placeholder='Nombre' value={dataPediatrician?.name || ""} type='text'  onChange={(e) => setDataPediatrician({ ...dataPediatrician, name: e.target.value })} />
                                                </FormControl>

                                                <FormControl>
                                                    <FormLabel>Institución médica</FormLabel>
                                                    <Input type="text" list="list-medical-institution" placeholder="Escriba la institución médica"
                                                    value={dataPediatrician?.medicalInstitution || ""}
                                                    onChange={(e) => setDataPediatrician({ ...dataPediatrician, medicalInstitution: e.target.value })} />
                                                    <datalist id="list-medical-institution">
                                                        <option value="HOMS"></option>
                                                        <option value="Unión Médica"></option>
                                                        <option value="Instituto Materno Infantil"></option>
                                                        <option value="Centro Médico Cibao"></option>
                                                        <option value="Clínica Coromina"></option>
                                                    </datalist>
                                                </FormControl>

                                                <FormControl>
                                                    <FormLabel>Número de oficina</FormLabel>
                                                    <NumberInput min={1}
                                                    value={dataPediatrician?.officeNumber ? parseInt(dataPediatrician.officeNumber) : ""}
                                                    onChange={(valueAsString, valueAsNumber) =>
                                                        setDataPediatrician({
                                                            ...dataPediatrician,
                                                            officeNumber: valueAsString,
                                                        })
                                                    }>
                                                        <NumberInputField/>
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                </FormControl>

                                                <FormControl isRequired>
                                                    <FormLabel>Número de telefono</FormLabel>
                                                    <Input placeholder='(000)-000-0000'
                                                    value={dataPediatrician?.phone || ""}
                                                    onChange={(e) => setDataPediatrician({ ...dataPediatrician, phone: e.target.value })}

                                                    />
                                                </FormControl>
                                            </CardBody>
                                        </Card>

                                        <FormControl>
                                                    <FormLabel>Condición médica</FormLabel>
                                                    <Input placeholder='Condición médica' value={dataStudentLocal.medicalCondition || ""}  onChange={(e)=> setDataStudentLocal({ ... dataStudentLocal, medicalCondition: e.target.value})} />
                                        </FormControl>
                                        
                                        <FormControl>
                                                    <FormLabel>Progreso deseado</FormLabel>
                                                    <Input placeholder='Progreso deseado' value={dataStudentLocal.progressDesired || ""}  onChange={(e)=> setDataStudentLocal({ ... dataStudentLocal, progressDesired: e.target.value})} />
                                        </FormControl>

                                        <FormControl>
                                                    <FormLabel>¿Algun comentario sobre su hijo/a?</FormLabel>
                                                    <Input placeholder='Escriba su comentario' value={dataStudentLocal.commentary || ""}  onChange={(e)=> setDataStudentLocal({ ... dataStudentLocal, commentary: e.target.value})} />
                                        </FormControl>
                                        
                                        <FormControl as='fieldset'>
                                            <FormLabel as='legend'>
                                                ¿Nos permites que su hijo salga en las fotos para nuestras redes sociales, documentos informativos y álbum de fotos de Saya Montessori?
                                            </FormLabel>
                                            <RadioGroup
                                                value={dataStudentLocal.allowedPictures.toString()} // Convierte el valor booleano a string
                                                onChange={(value) =>
                                                setDataStudentLocal({
                                                    ...dataStudentLocal,
                                                    allowedPictures: value === 'true', // Convierte el string de nuevo a booleano
                                                })
                                                }
                                            >
                                                <HStack spacing='24px'>
                                                <Radio value='true'>Si</Radio>
                                                <Radio value='false'>No</Radio>
                                                </HStack>
                                            </RadioGroup>
                                        </FormControl>


                                        <Button rightIcon={<ArrowForwardIcon />} colorScheme='blue' type="submit" variant='outline'>
                                            Enviar Solicitud
                                        </Button>
                                    </Stack>
                                </form>
                            }
                        </CardBody>
                    </Card>

                </Box>
            </Flex>
        
        </>
    )
}