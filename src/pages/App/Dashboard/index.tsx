import { Box, SimpleGrid, Card, CardBody, Heading, Button, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, Grid, GridItem } from '@chakra-ui/react';
import { NextPage } from 'next';
import Link from 'next/link';

const Dashboard: NextPage = () => {
    return(
        <>
            <Box px={3} py={3} width={'100%'} bgGradient={'radial(#cbdafa , #ffffff )'}>
                <SimpleGrid columns={2} spacing={10}>
                    <Card variant={'outline'}>
                        <CardBody>
                            <Heading as='h3' size='lg' mb={'20px'}>
                                ¡Bienvenido!
                            </Heading>

                            <SimpleGrid minChildWidth='120px' spacing='10px'>
                                <Button colorScheme='teal' size={'xs'}>
                                    <Link href='/App/RRHH#Staff'>
                                        Ver Staff
                                    </Link>
                                </Button>
                                <Button colorScheme='teal' size={'xs'}>
                                    <Link href='/App/Students#Parents'>
                                        Ver Padres
                                    </Link>
                                </Button>
                                <Button colorScheme='teal' size={'xs'}>
                                    <Link href='/App/StudentPrograms#Programs'>
                                        Ver Programas
                                    </Link>
                                </Button>
                                <Button colorScheme='teal' size={'xs'}>
                                    <Link href='/App/Camps#Camps'>
                                        Ver Campamentos
                                    </Link>
                                </Button>
                            </SimpleGrid>
                        </CardBody>
                    </Card>
                    <Card variant={'outline'}>
                        <CardBody>
                            <Heading as='h4' size='md' mb={'30px'}>
                                Inscripciones
                            </Heading>

                            <SimpleGrid minChildWidth='120px' spacing='10px'>
                                <Button colorScheme='teal' size={'xs'}>
                                    Listado de inscripciones
                                </Button>
                                <Button colorScheme='teal' size={'xs'}> 
                                    <Link  href='/Inscriptions/NewStudentForm' target='_blank'>Formulario estudiantes</Link>
                                </Button>
                                
                            </SimpleGrid>
                        </CardBody>
                    </Card>
                </SimpleGrid>
            </Box>
            
            <Box px={3} py={3} width={'100%'}>
                <SimpleGrid spacing={6} templateColumns='repeat(auto-fill, minmax(25%, 1fr))'>
                    <Card variant={'outline'}>
                        <CardBody>
                            <Stat>
                                <StatLabel>Metrica #1</StatLabel>
                                <StatNumber>345,670</StatNumber>
                                <StatHelpText>
                                    <StatArrow type='increase' />
                                    23.36%
                                </StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                    <Card variant={'outline'}>
                        <CardBody>
                            <Stat>
                                <StatLabel>Metrica #2</StatLabel>
                                <StatNumber>45</StatNumber>
                                <StatHelpText>
                                    <StatArrow type='decrease' />
                                    9.05%
                                </StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                    <Card variant={'outline'} >
                        <CardBody>
                            <Stat>
                                <StatLabel>Metrica #3</StatLabel>
                                <StatNumber>345,670</StatNumber>
                                <StatHelpText>
                                    <StatArrow type='increase' />
                                    23.36%
                                </StatHelpText>
                            </Stat>
                        </CardBody>
                    </Card>
                </SimpleGrid>
            </Box>

            <Box px={3} py={3} width={'100%'}>
                <Grid
                    h='500px'
                    templateRows='repeat(2, 1fr)'
                    templateColumns='repeat(5, 1fr)'
                    gap={4}
                >
                    <GridItem rowSpan={2} colSpan={2}>
                        <Card variant={'outline'} h={'100%'}>
                            <CardBody>
                                <Heading as='h5' size='sm'>
                                    Chart #1
                                </Heading>
                            </CardBody>
                        </Card>    
                    </GridItem> 

                    <GridItem rowSpan={1} colSpan={3}   >
                        <Card variant={'outline'} h={'100%'}>
                            <CardBody>
                                <Heading as='h5' size='sm'>
                                    Chart #2
                                </Heading>
                            </CardBody>
                        </Card>  
                    </GridItem>
                 
                    <GridItem rowSpan={1} colSpan={3} >
                        <Card variant={'outline'} h={'100%'}>
                            <CardBody>
                                <Heading as='h5' size='sm'>
                                    Chart #3
                                </Heading>
                            </CardBody>
                        </Card>  

                    </GridItem> 

                </Grid>
            </Box>
        </>
    )
}

export default Dashboard;