import { AddIcon, DeleteIcon, CheckIcon, ViewIcon } from '@chakra-ui/icons';
import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Box, Button, Flex, Center, Spinner, ButtonGroup, IconButton, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useColorMode, useDisclosure, useToast, Heading, Card, CardBody } from '@chakra-ui/react';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Parents from '../../../../components/Students/Parents/Parents';
import Students from '../../../../components/Students/Students/Students';

import { Student } from '../../../../components/Students/Students/Students';
import { Family } from '../../../../components/FamilyManagement/Family/Family';
import { User } from '../../../../components/FamilyManagement/User/Users';
import Tutors from '../../../../components/Students/Tutors/Tutor';
import EmergencyContacts from '../../../../components/Students/EmergencyContacts/EmergencyContacts';
import Cities from '../../../../components/Students/Cities/Cities';
import Pediatrician from '../../../../components/Students/Pediatricians/Pediatricians';

const Student: NextPage = () => {

    const [familySiblings, setFamilySiblings] = useState<Student[]>([]);
    
    const [dataFamily, setDataFamily] = useState<Family>({
        id: "",
        name: "",
        students: [],
        parents: [],
        user: {} as User,
    });


    return (
        <>
            
            <Students familyStudents={familySiblings} dataFamily={dataFamily} familyMode={false} enableEditing={true} programMode={false}/>
            {/* <Students dataFamily={dataFamily} familyMode={false} enableEditing={true}/> */}
                
            {/* <Tutors/>
            <EmergencyContacts/>
            <Pediatrician/>
            <Cities/> */}

        </>
    )
};

export default Student;