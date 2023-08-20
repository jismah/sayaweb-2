import { AddIcon, DeleteIcon, CheckIcon, ViewIcon } from '@chakra-ui/icons';
import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Box, Button, Flex, Center, Spinner, ButtonGroup, IconButton, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useColorMode, useDisclosure, useToast, Heading, Card, CardBody } from '@chakra-ui/react';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Parents from '../../../../components/Students/Parents/Parents';
import Students from '../../../../components/Students/Students/Students';

interface Student{
    id: string;
    name: string;
    lastName1: string;
    lastName2: string | null;
    dateBirth: string;
    housePhone: string;
    address: string;
    status: string;
  
    idFamily: string;
  }

const Student: NextPage = () => {

    const [familySiblings, setFamilySiblings] = useState<Student[]>([]);


    return (
        <>
            
            <Students familyStudents={familySiblings} familyMode={false}/>
                
            
        </>
    )
};

export default Student;