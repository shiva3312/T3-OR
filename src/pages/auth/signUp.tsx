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
import { signIn } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { api } from "~/utils/api";

export default function AuthenticationTitle() {
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
            response?.data?.userId ? await handleSingInRef() : console.log(response?.error?.message);
        }
    }

    const handleSingInRef = useCallback(async () => {
        try {
            signIn();
        } catch (error) {
            console.error('Error while redirecting to login:', error);
        }
    }, [])

    return (
        <Container size={470} py={50} >
            <Title ta="center" >
                Welcome back!
            </Title>
            <Text c="dimmed" size="sm" ta="center" mt={5}>
                Already have account ?{' '}
                <Anchor size="sm" component="button" onClick={handleSingInRef} >
                    Login
                </Anchor>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md" >
                <TextInput name='username' label="Email" placeholder="you@mantine.dev" required onChange={handleUser} />
                <PasswordInput name="password" label="Password" placeholder="Your password" required mt="md" onChange={handleUser} />
                <PasswordInput name="confirmPassword" label="Confirm Password" placeholder="Confirm password" required mt="md" onChange={handleUser} />
                <Button fullWidth mt="xl" bg={'blue'} onClick={handelSubmit}>
                    Sign Up
                </Button>
            </Paper>
        </Container>
    );
}