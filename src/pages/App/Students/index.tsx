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

const Student: NextPage = () => {

    const [familySiblings, setFamilySiblings] = useState<Student[]>([]);
    
    const initialUserData: User = {
    id: "",
    username: "",
    name: "",
    lastName1: "",
    lastName2: "",
    password: "",
    email: "",
    phone: "",
    role: "",

    idFamily: "",
  };
    const [dataFamily, setDataFamily] = useState<Family>({
        id: "",
        title: "",
        students: [],
        parents: [],
        user: initialUserData,
    });


    return (
        <>
            
            <Students familyStudents={familySiblings} dataFamily={dataFamily} familyMode={false} enableEditing={true}/>
            {/* <Students dataFamily={dataFamily} familyMode={false} enableEditing={true}/> */}
                
            
        </>
    )
};

export default Student;