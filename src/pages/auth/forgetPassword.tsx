import {
    Paper,
    Title,
    Text,
    TextInput,
    Button,
    Container,
    Group,
    Anchor,
    Center,
    Box,
} from '@mantine/core';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
    const router = useRouter();
    const handleSingInRef = async () => {
        try {
            await router.push('/auth/signIn');
        } catch (error) {
            console.error('Error while redirecting to login:', error);
        }
    }
    const handleResetPassword = () => {
        console.log("Password reset button clicked");
    }

    return (
        <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <Container size={460} my={30} className='text-white'>
                <Title ta="center">
                    Forgot your password?
                </Title>
                <Text c="dimmed" fz="sm" ta="center">
                    Enter your email to get a reset link
                </Text>

                <Paper withBorder shadow="md" p={30} radius="md" mt="xl" className='bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
                    <TextInput label="Your email" placeholder="me@mantine.dev" required />
                    <Group justify="space-between" mt="lg" >
                        <Anchor c="dimmed" size="sm" onClick={handleSingInRef} >
                            <Center inline>
                                <Box ml={5}>Back to the login page</Box>
                            </Center>
                        </Anchor>
                        <Button onClick={handleResetPassword} className='bg-gradient-to-b from-[#2e826d] to-[#15162c]'>Reset password</Button>
                    </Group>
                </Paper>
            </Container>
        </main>
    );
}