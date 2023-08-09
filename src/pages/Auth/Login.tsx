import { Box, Text, Flex, FormControl, Code, FormLabel, Heading, Input, Stack, CardHeader, useToast, CircularProgress, Checkbox, Container, Divider, HStack, Link, Center } from "@chakra-ui/react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from '@supabase/auth-helpers-react'
import { Button } from "@tremor/react";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import Image from 'next/image'
import { PasswordField } from "../../../components/Layouts/PasswordField";

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()
    const supabase = createClientComponentClient()

    const [loading, setLoading] = useState(false);
    const user = useUser()
    const toast = useToast()

    const handleSignIn = async () => {

        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            if (error.message == 'Invalid login credentials') {
                toast({
                    title: 'Credenciales Incorrectas',
                    description: "Hubo un problema, revisa tus credenciales!",
                    status: 'error',
                    duration: 4000,
                    isClosable: true,
                })
            }


            setTimeout(() => {
                setLoading(false);
            }, 4000)
        } else {
            router.push('/App/Dashboard');
        }

    }

    useEffect(() => {
        if (user) {
            router.push('/App/Dashboard');
        }
    }, [user]);

    if (!user) {
        return (
            <>
                <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
                    <Stack spacing="8">
                        <Stack spacing="6">
                            <Center>
                                <Image
                                    src="/favicon-saya.png"
                                    width={80}
                                    height={80}
                                    alt=""
                                />
                            </Center>
                            <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
                                <Heading size={{ base: 'lg', md: 'lg' }}>Saya Montessori</Heading>
                                <Text color="fg.muted" size='sm'>
                                    Ingresa tus credenciales para iniciar sesión
                                </Text>
                            </Stack>
                        </Stack>
                        <Box
                            py={{ base: '0', sm: '4' }}
                            px={{ base: '4', sm: '4' }}
                            bg={{ base: 'transparent', sm: 'bg.surface' }}
                            boxShadow={{ base: 'none' }}
                            borderRadius={{ base: 'none', sm: 'lg' }}
                        >
                            <Stack spacing="6">
                                <Stack spacing="5">
                                    <FormControl>
                                        <FormLabel htmlFor="email">Email</FormLabel>
                                        <Input value={email} id="email" type="email" onChange={(e) => setEmail(e.target.value)} />
                                    </FormControl>
                                    <PasswordField value={password} onChange={(e) => setPassword(e.target.value)} />
                                </Stack>
                                <HStack justify="space-between">
                                    <Checkbox defaultChecked>Recuérdame</Checkbox>
                                    <Button variant="light" size="sm">
                                        ¿Has olvidado tu contraseña?
                                    </Button>
                                </HStack>
                                <Stack spacing="6">
                                    <Button loading={loading} loadingText={'Ingresando...'} onClick={handleSignIn}>
                                        Ingresar
                                    </Button>

                                </Stack>
                            </Stack>
                        </Box>
                    </Stack>
                </Container>
            </>
        )
    }
    return (
        <>
            <Box minHeight={'100vh'} minWidth={'100vw'} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <CircularProgress isIndeterminate size='80px' thickness='4px' />
            </Box>
        </>
    )
}
