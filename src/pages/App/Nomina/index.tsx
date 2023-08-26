import { AddIcon, ChevronLeftIcon, ChevronRightIcon, RepeatIcon } from '@chakra-ui/icons';
import { Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Center, Flex, Grid, GridItem, HStack, Heading, IconButton, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberInput, NumberInputField, SimpleGrid, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Tab, TabList, Tabs, Text, useDisclosure, useNumberInput, useToast } from '@chakra-ui/react';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import ListNomina from '../../../../components/Nomina/ListNomina';
import ListNominaById from '../../../../components/Nomina/ListNominaById';
import { useRouter } from 'next/router';
import ListNominaByStaff from '../../../../components/Nomina/ListNominaByStaff';
import CreateNomina from '../../../../components/Nomina/CreateNomina';
import CreateDetailNomina from '../../../../components/Nomina/CreateDetailNomina';

const Nominas: NextPage = () => {
    const router = useRouter();
    const toast = useToast();
    
    const [SearchId, setSearchId] = useState('');

    useEffect(() => {
        if ((!Number.isNaN(Number(SearchId))) && !(SearchId === '')) {
            setidNomina(SearchId);
            setDisplayId(SearchId);

            setByStaff(false);
            setById(true);

            setSearchId('');
        }
    }, [SearchId]);

    const [reloadComponents, setReloadComponents] = useState(false);
    const [reloadYear, setReloadYear] = useState('');
    const [remoteOpenDetail, setRemoteOpenDetail] = useState(false);

    const [byId, setById] = useState(false);
    const [idNomina, setidNomina] = useState('');
    const [displayId, setDisplayId] = useState('');

    const [byStaff, setByStaff] = useState(false);
    const [staffId, setStaffId] = useState('');
    const [displayStaff, setDisplayStaff] = useState('');
  
    const handleIdSearch = () => {
        if (idNomina != "") {
            setDisplayId(idNomina);
            setByStaff(false);
            setById(true);
        }
    };    

    const handleStaffSearch = () => {
        if (staffId != '') {
            setDisplayStaff(staffId);
            setById(false);
            setByStaff(true);
        }
    };
  
    const handleIdReset = () => {
      setidNomina('');
      setById(false);
      console.log('ID Search reset');
    };
  
    const handleStaffReset = () => {
      setStaffId('');
      setByStaff(false);
      console.log('Staff Search reset');
    };

    // Create Nomina
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Create Detail Nomina
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const openDetail = () => {
        setIsDetailOpen(true);
    };

    const closeDetail = () => {
        setIsDetailOpen(false);
    };
    
    useEffect(() => {
        if (remoteOpenDetail) {
            openDetail();
            setRemoteOpenDetail(false);
        }
    }, [remoteOpenDetail]);

    return (
        <>
            <main>
                <Box px={3} py={3}>
                    
                    {/* Create New Nomina Modal */}
                    <CreateNomina isOpen={isModalOpen} onClose={closeModal}/>

                    {/* Create New Detail Nomina Modal */}
                    <CreateDetailNomina isOpen={isDetailOpen} onClose={closeDetail} reloadData={setReloadComponents} 
                    id={byId ? Number(displayId) : undefined} staffId={byStaff ? Number(displayStaff) : undefined}
                    reloadYear={setReloadYear}/>

                    {/* Buttons */}
                    <Flex justifyContent={'space-between'} alignItems={'center'}>
                        <Heading as='h3' size='xl'><Link href='/App/Nomina' textDecoration={'none'}>Nominas</Link></Heading>
                        <ButtonGroup gap={3} alignItems={'center'}>
                            <Button size='sm' variant={'outline'} leftIcon={<AddIcon />} onClick={openDetail}>
                                Nuevo Detalle Nomina
                            </Button>
                            <Button size='sm' variant={'outline'} leftIcon={<AddIcon />} onClick={openModal}>
                                Nueva Nomina
                            </Button>
                        </ButtonGroup>
                    </Flex>

                    <Box display="inline-block" pt={5}>
                    
                    {/* Search by ID */}
                    <Box display={'flex'} gap={'70px'}>
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
                            width: '10.5ch',
                            height: '100%',
                            backgroundColor: 'white',
                            zIndex: -1,
                            }}
                        >
                            ID NOMINA
                        </Text>
                        </Box>

                        <NumberInput minW={110}>
                        <Input
                            type="number"
                            min={2000}
                            max={2100}
                            step={1}
                            textAlign={'center'}
                            value={idNomina}
                            onChange={(e) => setidNomina(e.target.value)}
                            onBlur={(e) => {
                                if (!/^\d+$/.test(idNomina)) {
                                    setidNomina('');
                                    e.target.style.borderColor = '#C44D4D';
                                    e.target.style.borderWidth = '2px';
                                }
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = '';
                              }}
                        />
                        </NumberInput>
                        </Box>

                        {/* Search Button */}
                        <Button
                            alignSelf={'end'}
                            variant={'outline'}
                            fontWeight={400}
                            textColor={'#008080'}
                            onClick={handleIdSearch}
                        >
                            Buscar
                        </Button>

                        {/* Reset Button */}
                        <IconButton
                            alignSelf={'end'}
                            bg={'transparent'}
                            aria-label={'Reset Search'}
                            opacity={0.7}
                            icon={<RepeatIcon />}
                            onClick={handleIdReset}
                        ></IconButton>
                    </Flex>
                    
                    {/* Search by Staff */}
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
                            width: '12.5ch',
                            height: '100%',
                            backgroundColor: 'white',
                            zIndex: -1,
                            }}
                        >
                            ID EMPLEADO
                        </Text>
                        </Box>

                        <NumberInput minW={110}>
                        <Input
                            type="number"
                            min={2000}
                            max={2100}
                            step={1}
                            textAlign={'center'}
                            value={staffId}
                            onChange={(e) => setStaffId(e.target.value)}
                            onBlur={(e) => {
                                if (!/^\d+$/.test(staffId)) {
                                    setStaffId('');
                                    e.target.style.borderColor = '#C44D4D';
                                    e.target.style.borderWidth = '2px';
                                }
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = '';
                              }}
                        />
                        </NumberInput>
                        </Box>

                        {/* Search Button */}
                        <Button
                            alignSelf={'end'}
                            variant={'outline'}
                            fontWeight={400}
                            textColor={'#008080'}
                            onClick={handleStaffSearch}
                        >
                            Buscar
                        </Button>

                        {/* Reset Button */}
                        <IconButton
                            alignSelf={'end'}
                            bg={'transparent'}
                            aria-label={'Reset Search'}
                            opacity={0.7}
                            icon={<RepeatIcon />}
                            onClick={handleStaffReset}
                        ></IconButton>
                    </Flex>
                    </Box>
                    </Box>
                    
                    {/* Table */}
                    <Box>
                    { byId ?
                        <ListNominaById idNomina={displayId} reload={reloadComponents} setReload={setReloadComponents} remote={setRemoteOpenDetail}/>
                    : byStaff ?
                        <ListNominaByStaff idStaff={displayStaff} reload={reloadComponents} setReload={setReloadComponents} reloadYear={reloadYear}/>
                    :
                        <ListNomina setSearchId={setSearchId}/>
                    }
                    </Box>

                </Box>
            </main>
        </>
    )
}; 

export default Nominas;