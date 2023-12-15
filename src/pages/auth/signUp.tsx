import {
    TextInput,
    PasswordInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Button,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { api } from "~/utils/api";


export default function AuthenticationTitle() {
    const router = useRouter();
    const createUser = api.auth.create.useMutation();

    const [user, setUser] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    })

    const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const handelSubmit = async () => {
        if (user.username !== '' && user.password !== '' && user.confirmPassword !== '' && user.password === user.confirmPassword) {
            const response = await createUser.mutateAsync(user);
            if (response?.error) {
                console.log(response?.error?.message, response)
            } else {
                response?.data?.userId ? await handleSingInRef() : console.log(createUser.data?.error?.message);
            }
        }
    }

    const handleSingInRef = useCallback(async () => {
        try {
            await router.push('/auth/signIn');
        } catch (error) {
            console.error('Error while redirecting to login:', error);
        }
    }, [router])

    return (
        <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <Container size={470} my={40} className='text-white w-80'>
                <Title ta="center" >
                    Welcome back!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Already have account ?{' '}
                    <Anchor size="sm" component="button" onClick={handleSingInRef} >
                        Login
                    </Anchor>
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md" className='bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
                    <TextInput name='username' label="Email" placeholder="you@mantine.dev" required onChange={handleUser} />
                    <PasswordInput name="password" label="Password" placeholder="Your password" required mt="md" onChange={handleUser} />
                    <PasswordInput name="confirmPassword" label="Confirm Password" placeholder="Confirm password" required mt="md" onChange={handleUser} />
                    <Button fullWidth mt="xl" className='bg-gradient-to-b from-[#2e826d] to-[#15162c]' onClick={handelSubmit}>
                        Sign Up
                    </Button>
                </Paper>
            </Container>
        </main >
    );
}