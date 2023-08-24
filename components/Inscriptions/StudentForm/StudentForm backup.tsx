import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Card, CardBody, CardHeader, Flex, FormControl, FormLabel, SimpleGrid, HStack, Heading, Input, Radio, RadioGroup, Select, Stack, Text, useToast, NumberInput, NumberInputField, NumberDecrementStepper, NumberIncrementStepper, NumberInputStepper } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';


import { Student } from '../../Students/Students/Students';
  
import { Parent } from '../../Students/Parents/Parents';

import { Pediatrician } from "../../Students/Pediatricians/Pediatricians";
import { EmergencyContact } from "../../Students/EmergencyContacts/EmergencyContacts";
import { Tutor } from "../../Students/Tutors/Tutor";

export default function StudentForm({dataParents, dataStudent, editingMode} : {dataParents : Parent[]; dataStudent : Student; editingMode : boolean}) {
    const [dataStudentLocal, setDataStudentLocal] = useState<Student>({
        ...dataStudent,
    });
    
    const [dataPediatrician, setDataPediatrician] = useState<Pediatrician>({
        id: "",
        name: "",
        medicalInstitution: "",
        officeNumber: "",
        phone: "",
        students: [],
    });
    
    const [dataEmergencyContact, setDataEmergencyContact] = useState<EmergencyContact>({
        id: "",
        name: "",
        phone: "",
        idStudent: "",
    });

    const [dataTutor, setDataTutor] = useState<Tutor>({
        id: "",
        name: "",
        occupation: "",
        phone: "",
        idStudent: "",
    });

    const [dataEmergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
    const [dataTutors, setTutors] = useState<Tutor[]>([]);

    const [parentStates, setParentStates] = useState<Parent[]>([]);
    const [dataParent1Local, setDataParent1Local] = useState<Parent>({
        ...dataParents[0],
    });
    const [dataParent2Local, setDataParent2Local] = useState<Parent>({
        ...dataParents[1],
    });

    useEffect(() => {
        if (dataParents.length >= 2) {
          setParentStates(dataParents.slice(0, 2));
        }
      }, [dataParents]);

    // const handleParentChange = (index: number, updatedParent: Parent) => {
    //     const updatedParents = [...parentStates];
    //     updatedParents[index] = updatedParent;
    //     setParentStates(updatedParents);
    // };
    

    const toast = useToast();
    


    const handleSubmit  = async (e:React.FormEvent) => {
      e.preventDefault()
      try{
        //FETCH TO PARENT
        const resParent = await fetch('http://localhost:3000/api/parents/', {
            method: 'POST',
            headers: {
            "Content-Type": "application/json",
            "x-api-key": "123456",
            },
            body: JSON.stringify(dataStudentLocal)
        });
        const jsonParent = await resParent.json();

        toast({
            title: 'Registro Creado!',
            description: "Se creo el registro correctamente.",
            status: 'success',
            position: 'bottom-right',
            duration: 4000,
            isClosable: true,
        });


        //FETCH TO STUDENT
        const resStudent = await fetch('http://localhost:3000/api/students/', {
            method: 'POST',
            headers: {
            "Content-Type": "application/json",
            "x-api-key": "123456",
            },
            body: JSON.stringify(dataStudentLocal)
        });
        const jsonStudent = await resStudent.json();

        toast({
            title: 'Registro Creado!',
            description: "Se creo el registro correctamente.",
            status: 'success',
            position: 'bottom-right',
            duration: 4000,
            isClosable: true,
        });

        //FETCH TO TUTOR

        //FETCH TO EMERGENCY CONTACT

        //FETCH TO PEDIATRICIAN


        setDataStudentLocal({
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
            emergencyContacts: [],
            tutors: [],
            idFamily: "", 
        });
    
    
        // setDataParent1Local({
        //     id: "",
        //     identityCard: "",
        //     name: "",
        //     lastName1: "",
        //     lastName2: "",
        //     telephone: "",
        //     email: "",
        //     occupation: "",
        //     idFamily: "",
        //     children: [],
        // });

        // setDataParent2Local({
        //     id: "",
        //     identityCard: "",
        //     name: "",
        //     lastName1: "",
        //     lastName2: "",
        //     telephone: "",
        //     email: "",
        //     occupation: "",
        //     idFamily: "",
        //     children: [],
        // });

        
      }catch(error){
        console.error(error);
      }
    };
    
   

    const fetchData = async () => {
        try {
            const pediatricianResponse = await fetch(`http://localhost:3000/api/pediatricians/${dataStudentLocal.idPediatrician}`, {
                method: 'GET',
                headers: {
                "Content-Type": "application/json",
                "x-api-key": "123456",
            },
            });
            const jsonPediatrician = await pediatricianResponse.json();
            console.log(jsonPediatrician);
        
            setDataPediatrician(jsonPediatrician.response); // ACTUALIZAR EL ESTADO
        
        } catch (error) {
            console.error(error);
            // MANEJO DE ERRORES
        } 
    
    }

    if(editingMode){

        //Se está editando un estudiante. 
        //Ahora se recopilarán las relaciones de dicho estudiante

        fetchData();
    }


    return (
        <>
            <Flex justifyContent={'center'}>
                <Box px={3} py={3} >

                    <Heading mb={3}>Solicitud de Inscripción</Heading>
                    <Text pb={6}>Ingresa los datos sobre tu hijo/a</Text>
                    <Card variant={'outline'}>
                        <CardBody>
                            <form onSubmit={handleSubmit}>
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

                                    <FormControl isRequired>
                                        <FormLabel>Ciudad</FormLabel>
                                        <Select placeholder='Seleccionar ciudad'>
                                            <option>Santiago</option>
                                            <option>La Vega</option>
                                        </Select>
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>Programa</FormLabel>
                                        <Select placeholder='Seleccionar programa'>
                                            <option>Montessori Staters</option>
                                            <option>Mañanas Montessori</option>
                                            <option>Tardes Montessori</option>
                                        </Select>
                                    </FormControl>

                                    <Card >
                                        <CardHeader>
                                            <Heading size='md'>Padre o madre n°1</Heading>
                                        </CardHeader>
                                        
                                        <CardBody>
                                            <FormControl isRequired>
                                                <FormLabel>Nombre</FormLabel>
                                                <Input value={dataParent1Local.name || ""} type='text'  onChange={(e) => setDataParent1Local({ ...dataParent1Local, name: e.target.value })} />
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Primer apellido</FormLabel>
                                                <Input value={dataParent1Local.lastName1 || ""} type='text'  onChange={(e) => setDataParent1Local({ ...dataParent1Local, lastName1: e.target.value })} />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Segundo apellido</FormLabel>
                                                <Input value={dataParent1Local.lastName2 || ""} type='text'  onChange={(e) => setDataParent1Local({ ...dataParent1Local, lastName2: e.target.value })} />
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Cédula</FormLabel>
                                                <Input value={dataParent1Local.identityCard || ""} type='text' onChange={(e) => setDataParent1Local({ ...dataParent1Local, identityCard: e.target.value })} />
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Correo eléctronico</FormLabel>
                                                <Input value={dataParent1Local.email || ""} type='email'  onChange={(e) => setDataParent1Local({ ...dataParent1Local, email: e.target.value })} />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Ocupación</FormLabel>
                                                <Input value={dataParent1Local.occupation || ""} type='text'  onChange={(e) => setDataParent1Local({ ...dataParent1Local, occupation: e.target.value })} />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Número de telefono</FormLabel>
                                                <Input value={dataParent1Local.telephone || ""} type='tel'  onChange={(e) => setDataParent1Local({ ...dataParent1Local, telephone: e.target.value })} />
                                            </FormControl>
                                        </CardBody>
                                    </Card>


                                    <Card>
                                        <CardHeader>
                                            <Heading size='md'>Padre o madre n°2</Heading>
                                        </CardHeader>
                                        
                                        <CardBody>
                                            <FormControl isRequired>
                                                <FormLabel>Nombre</FormLabel>
                                                <Input value={dataParent2Local.name || ""} type='text'  onChange={(e) => setDataParent2Local({ ...dataParent2Local, name: e.target.value })} />
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Primer apellido</FormLabel>
                                                <Input value={dataParent2Local.lastName1 || ""} type='text'  onChange={(e) => setDataParent2Local({ ...dataParent2Local, lastName1: e.target.value })} />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Segundo apellido</FormLabel>
                                                <Input value={dataParent2Local.lastName2 || ""} type='text'  onChange={(e) => setDataParent2Local({ ...dataParent2Local, lastName2: e.target.value })} />
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Cédula</FormLabel>
                                                <Input value={dataParent2Local.identityCard || ""} type='text' onChange={(e) => setDataParent2Local({ ...dataParent2Local, identityCard: e.target.value })} />
                                            </FormControl>

                                            <FormControl isRequired>
                                                <FormLabel>Correo eléctronico</FormLabel>
                                                <Input value={dataParent2Local.email || ""} type='email'  onChange={(e) => setDataParent2Local({ ...dataParent2Local, email: e.target.value })} />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Ocupación</FormLabel>
                                                <Input value={dataParent2Local.occupation || ""} type='text'  onChange={(e) => setDataParent2Local({ ...dataParent2Local, occupation: e.target.value })} />
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Número de telefono</FormLabel>
                                                <Input value={dataParent2Local.telephone || ""} type='tel'  onChange={(e) => setDataParent2Local({ ...dataParent2Local, telephone: e.target.value })} />
                                            </FormControl>
                                        </CardBody>
                                    </Card>
                                

                                    <Card>
                                        <CardHeader>
                                            <Heading size='md'>Datos del tutor</Heading>
                                        </CardHeader>
                                        
                                        <CardBody>
                                            {/* <CreateTutor/> */}
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
                                                <Select placeholder='Seleccionar institución'
                                                 value={dataPediatrician?.medicalInstitution || ""}
                                                 onChange={(e) => setDataPediatrician({ ...dataPediatrician, medicalInstitution: e.target.value })}
                                                 >
                                                    <option>HOMS</option>
                                                    <option>Unión Médica</option>
                                                </Select>
                                            </FormControl>

                                            <FormControl>
                                                <FormLabel>Número de oficina</FormLabel>
                                                <NumberInput max={20} min={1}
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
                            
                        </CardBody>
                    </Card>

                </Box>
            </Flex>
        
        </>
    )
}