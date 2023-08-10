import React, { useEffect } from "react";
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { Flex, useColorModeValue, Heading, useBreakpointValue, Button, Stack, Menu, MenuButton, Avatar, MenuList, MenuItem, Box, useColorMode, HStack, Show, Hide } from "@chakra-ui/react";
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Image from 'next/image'

const Navbar: React.FC = () => {

    // CHAKRA UI
    const { colorMode, toggleColorMode } = useColorMode();
    const supabaseClient = useSupabaseClient()
    const user = useUser()
    const router = useRouter()


    const handleSignOut = async () => {
        await supabaseClient.auth.signOut()
        router.push('/Auth/Login');
    }

    return (
        <header>
            {/* NAVBAR */}
            <Box>
                <Flex py={2} px={4} alignItems={'center'} justifyContent={'space-between'} as="header" zIndex={200} position="fixed"
                    bg={useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(26, 32, 44, 0.8)')} backdropFilter="saturate(180%) blur(5px)" w="100%" borderBottom={1} borderStyle={'solid'} borderColor={useColorModeValue('gray.200', 'gray.900')}>
                    <Box>

                        <Flex alignItems={'center'}>

                            <Box className="mr-2">
                                <Image
                                    src="/favicon-saya.png"
                                    width={30}
                                    height={30}
                                    alt=""
                                />
                            </Box>

                            <Heading
                                as={NextLink}
                                href="/App/Dashboard"
                                size='sm'
                                mr={5}
                                textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                                color={useColorModeValue('gray.800', 'white')}>
                                Saya Montessori
                            </Heading>

                            
                            <HStack as="nav" spacing="1">
                                
                                <Button as={NextLink} colorScheme='teal' variant='ghost' href='/App/Dashboard' size={'sm'}>
                                    Inicio
                                </Button>
                                <Button as={NextLink} colorScheme='teal' variant='ghost' href='/App/Students' size={'sm'}>
                                    Estudiantes
                                </Button>
                                <Button as={NextLink} colorScheme='teal' variant='ghost' href='/App/FamilyManagement' size={'sm'}>
                                    Gestión Familiar
                                </Button>
                                <Button as={NextLink} colorScheme='teal' variant='ghost' href='/App/StudentPrograms' size={'sm'}>
                                    Programas
                                </Button>
                                <Button as={NextLink} colorScheme='teal' variant='ghost' href='/App/Camps' size={'sm'}>
                                    Campamentos
                                </Button>
                                <Button as={NextLink} colorScheme='teal' variant='ghost' href='/App/FinancialManager' size={'sm'}>
                                    Gestor Financiero
                                </Button>
                            </HStack>
                            {/* </Hide> */}
                        </Flex>
                    </Box>

                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={4}>

                            {/* <Button variant={'ghost'} onClick={toggleColorMode}>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </Button> */}


                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded={'full'}
                                    variant={'link'}
                                    cursor={'pointer'}
                                    minW={0}>
                                    <Avatar
                                        size={'sm'}

                                    />
                                </MenuButton>
                                <MenuList alignItems={'center'}>
                                    <MenuItem>Mi Cuenta</MenuItem>
                                    <MenuItem onClick={() => handleSignOut()}>Cerrar Sesión</MenuItem>
                                </MenuList>
                            </Menu>


                            {/* <Show breakpoint='(max-width: 860px)'>
                                <MobileDrawer />
                            </Show> */}
                        </Stack>
                    </Flex>
                </Flex>
            </Box>
        </header>
    );
}

export default Navbar;