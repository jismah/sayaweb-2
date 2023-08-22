import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Center, Flex, Grid, GridItem, HStack, Heading, IconButton, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, SimpleGrid, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Tab, TabList, Tabs, Text, useDisclosure, useNumberInput } from '@chakra-ui/react';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import ListNomina from '../../../../components/Nomina/ListNomina';

const Nominas: NextPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Create New Nomina Modal
    const openCreateModal = () => {
        console.log("Create button clicked");
        onOpen();
    };
    
    return (
        <>
            <main>
                <Box px={3} py={3}>
                    <Flex justifyContent={'space-between'} alignItems={'center'}>
                        <Heading as='h3' size='xl'>Nominas</Heading>
                        <ButtonGroup gap={3} alignItems={'center'}>
                            <Link size='sm' variant={'outline'} textColor={'#008080'} href='/'>
                                Buscar por empleado
                            </Link>
                            <Button size='sm' variant={'outline'} leftIcon={<AddIcon />} onClick={openCreateModal}>
                                Nueva Nomina
                            </Button>
                        </ButtonGroup>
                    </Flex>

                    <Modal onClose={onClose} size={'full'} isOpen={isOpen}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Nueva Nomina</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Box px={3} py={3}>
                                    
                                </Box>
                            </ModalBody>
                            <ModalFooter>
                                <Button onClick={onClose}>Cerrar</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                    <Box display="inline-block" pt={1}>
                    
                    {/* Search by ID */}
                    <Flex w='100%' justifySelf={'left'} justifyContent={'left'} gap={2} pb={1}>
                        <Box alignSelf={'end'}>

                        <Box position={'relative'} zIndex={1} pl={2} mb={-2.5}>
                        <Text
                            fontSize='sm'
                            textColor={'rgba(0,128,128,0.7)'}
                            _before={{
                            content: "''",
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            left: 1.5,
                            width: '2.5ch',
                            height: '100%',
                            backgroundColor: 'white',
                            zIndex: -1,
                            }}
                        >
                            ID
                        </Text>
                        </Box>

                        <NumberInput maxW={150} min={0}>
                        <NumberInputField />
                        </NumberInput>

                        </Box>
                        <Button alignSelf={'end'} variant={'outline'} fontWeight={400} textColor={'#008080'}>Buscar</Button>
                    </Flex>
                    </Box>
                    
                    {/* Table */}
                    <Box>
                        <ListNomina />
                    </Box>

                </Box>
            </main>
        </>
    )
}; 

export default Nominas;