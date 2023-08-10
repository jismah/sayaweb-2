import { AddIcon, DeleteIcon, CheckIcon, ViewIcon } from '@chakra-ui/icons';
import { TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Box, Button, Flex, Center, Spinner, ButtonGroup, IconButton, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useColorMode, useDisclosure, useToast, Heading, Card, CardBody } from '@chakra-ui/react';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import Parents from '../../../../components/Students/Parents/Parents';


const Student: NextPage = () => {

    const [dataStudents, setDataStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataStudent, setDataStudent] = useState({
        id: "",
        name: "",
        lastName1: "",
        lastName2: ""
    });
    const toast = useToast();
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();

    // GET DATA TO LOAD ARRAY
    const fetchData = async () => {
        const res = await fetch('http://localhost:3000/api/students', {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "x-api-key": "123456",
            },
        });
        const json = await res.json();
        setDataStudents(json.response);
        setLoading(false);
        console.log(json.response);
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            


                <Parents/>
                

            
        </>
    )
};

export default Student;