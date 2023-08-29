import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { Box, Button, ButtonGroup, Flex, Heading, IconButton, Input, Link, NumberInput, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import ListNomina from '../../../../components/Nomina/ListNomina';
import ListNominaById from '../../../../components/Nomina/ListNominaById';
import ListNominaByStaff from '../../../../components/Nomina/ListNominaByStaff';
import CreateNomina from '../../../../components/Nomina/CreateNomina';
import CreateDetailNomina from '../../../../components/Nomina/CreateDetailNomina';
import NominaDoc from '../../../../components/Nomina/NominaDoc';
import { useUser } from '@supabase/auth-helpers-react';
import router from 'next/router';

const Nominas: NextPage = () => {
    const user = useUser();
    
    const [SearchId, setSearchId] = useState('');
    const [SearchYear, setSearchYear] = useState('');
    const [displayYear, setDisplayYear] = useState('');

    const [nominaEditMode, setNominaEditMode] = useState(false);
    const [nominaEditData, setNominaEditData] = useState({
        idNomina: '',
        date: '',
    });

    const [detailEditMode, setDetailEditMode] = useState(false);
    const [detailEditData, setDetailEditData] = useState({
        idNomina: '0',
        idStaff: '0',
        date: "",
        salary: '0',
        extraDays: '0',
        overtimePay: '0',
        sfs: '0',
        afp: '0',
        loans: '0',
        other: '0',
        total: 0,
    });

    const [reloadComponents, setReloadComponents] = useState(false);
    const [reloadYear, setReloadYear] = useState('');
    const [remoteOpenDetail, setRemoteOpenDetail] = useState({status: false, id: ''});

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
        if (remoteOpenDetail.status) {
            setidNomina(remoteOpenDetail.id);
            setDisplayId(remoteOpenDetail.id);

            setByStaff(false);
            setById(true);

            openDetail();
            setRemoteOpenDetail({status: false, id: ''})
        }
    }, [remoteOpenDetail]);

    useEffect(() => {
        if (nominaEditMode) {
            openModal();
        }
    }, [nominaEditMode]);

    useEffect(() => {
        if (detailEditMode) {
            openDetail();
        }
    }, [detailEditMode]);

    useEffect(() => {
        if ((!Number.isNaN(Number(SearchYear))) && !(SearchYear === '')) {
            setByStaff(false);
            setById(false);
            
            setDisplayYear(SearchYear)
            setSearchYear('');
        }
    }, [SearchYear]);

    useEffect(() => {
        if ((!Number.isNaN(Number(SearchId))) && !(SearchId === '')) {
            setidNomina(SearchId);
            setDisplayId(SearchId);

            setByStaff(false);
            setById(true);

            setSearchId('');
        }
    }, [SearchId]);

    // ACH Document Modal
    const [isDocOpen, setIsDocOpen] = useState(false);
    const [docNomina, setDocNomina] = useState('');

    const openDoc = (id: string) => {
        setDocNomina(id)
        setIsDocOpen(true);
    };

    const closeDoc = () => {
        setIsDocOpen(false);
    };

    // Startup
    useEffect(() => {
        if (!user) {
            router.push('/Auth/Login');
        }
    }, []);

    return (
        <>
            <main>
                <Box px={3} py={3}>
                    
                    {/* Create New Nomina Modal */}
                    <CreateNomina isOpen={isModalOpen} onClose={closeModal} editMode={nominaEditMode} data={nominaEditData}
                        setters = {{
                            setEditMode: setNominaEditMode,
                            setEditData: setNominaEditData,
                            remoteSearch: setSearchId,
                            setRemoteYear: setSearchYear,
                        }
                     }/>

                    {/* Create New Detail Nomina Modal */}
                    <CreateDetailNomina isOpen={isDetailOpen} onClose={closeDetail}  
                    id={byId ? displayId.toString() : undefined} staffId={byStaff ? displayStaff.toString() : undefined}
                    editMode={detailEditMode} editData={detailEditData}
                    setters={{
                        reloadData: setReloadComponents,
                        reloadYear: setReloadYear,
                        setEditMode: setDetailEditMode,
                        setEditData: setDetailEditData,
                        remoteSearchId: setSearchId, 
                    }}/>

                    {/* Nomina Document */}
                    <NominaDoc isOpen={isDocOpen} onClose={closeDoc} idNomina={docNomina}/>

                    {/* Buttons */}
                    <Flex justifyContent={'space-between'} alignItems={'center'}>
                        <Heading as='h3' size='xl'><Link href='/App/Nomina' textDecoration={'none'}>Nóminas</Link></Heading>
                        <ButtonGroup gap={3} alignItems={'center'}>
                            <Button size='sm' variant={'outline'} leftIcon={<AddIcon />} onClick={openDetail}>
                                Nuevo Detalle Nómina
                            </Button>
                            <Button size='sm' variant={'outline'} leftIcon={<AddIcon />} onClick={openModal}>
                                Nueva Nómina
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
                            ID NÓMINA
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
                        <ListNominaById idNomina={displayId} reload={reloadComponents} 
                            setters = {{
                                setReload: setReloadComponents,
                                remote: setRemoteOpenDetail,
                                setEditMode: setNominaEditMode,
                                setEditData: setNominaEditData,
                                setDetailEditMode: setDetailEditMode,
                                setDetailEditData: setDetailEditData,
                                remoteDoc: openDoc
                        }}/>
                    : byStaff ?
                        <ListNominaByStaff idStaff={displayStaff} reload={reloadComponents} reloadYear={reloadYear}
                        setters={{
                            setReload: setReloadComponents,
                            remoteSearchId: setSearchId,
                            setDetailEditMode: setDetailEditMode,
                            setDetailEditData: setDetailEditData,
                        }}/>
                    :
                        <ListNomina displayYear={displayYear} setDisplayYear={setDisplayYear} setSearchId={setSearchId} remoteDoc= {openDoc}/>
                    }
                    </Box>

                </Box>
            </main>
        </>
    )
}; 

export default Nominas;