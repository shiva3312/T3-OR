import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
} from '@mantine/core';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function AuthenticationTitle() {
    const router = useRouter();
    const [user, setUser] = useState<{ username: string, password: string }>({
        username: '',
        password: '',
    })

    const handleUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser((pre) => ({ ...pre, [e.target.name]: e.target.value }))
    }

    const handleSingUpRef = async () => {
        try {
            await router.push('/auth/signUp');
        } catch (error) {
            console.error('Error while redirecting to login:', error);
        }
    }

    const handleForgetPassword = async () => {
        try {
            await router.push('/auth/forgetPassword');
        } catch (error) {
            console.error('Error while redirecting to login:', error);
        }
    }

    async function handleSingInRef(e: React.FormEvent) {
        e.preventDefault();
        await signIn('credentials', {
            username: user.username,
            password: user.password,
            callbackUrl: '/',
        });
    }

    return (
        <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <Container size={420} my={40} className='text-white'>
                <Title ta="center" >
                    Welcome back!
                </Title>
                <Text c="dimmed" size="sm" ta="center" mt={5}>
                    Do not have an account yet?{' '}
                    <Anchor size="sm" component="button" onClick={handleSingUpRef} >
                        Create account
                    </Anchor>
                </Text>

                <Paper withBorder shadow="md" p={30} mt={30} radius="md" className='bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
                    <TextInput label="Email" name="username" placeholder="you@mantine.dev" required onChange={handleUser} />
                    <PasswordInput label="Password" name="password" placeholder="Your password" required mt="md" onChange={handleUser} />
                    <Group justify="space-between" mt="lg">
                        <Checkbox label="Remember me" />
                        <Anchor component="button" size="sm" onClick={handleForgetPassword}>
                            Forgot password?
                        </Anchor>
                    </Group>
                    <Button fullWidth mt="xl" className='bg-gradient-to-b from-[#2e826d] to-[#15162c]' onClick={handleSingInRef}>
                        Sign In
                    </Button>
                </Paper>
            </Container>
        </main >
    );
}