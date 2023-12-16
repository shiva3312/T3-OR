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
        <Container size={470} py={50} >
            <Title ta="center">
                Forgot your password?
            </Title>
            <Text c="dimmed" fz="sm" ta="center">
                Enter your email to get a reset link
            </Text>

            <Paper withBorder shadow="md" p={30} radius="md" mt="xl" >
                <TextInput label="Your email" placeholder="me@mantine.dev" required />
                <Group justify="space-between" mt="lg" >
                    <Anchor c="dimmed" size="sm" onClick={handleSingInRef} >
                        <Center inline>
                            <Box ml={5}>Back to the login page</Box>
                        </Center>
                    </Anchor>
                    <Button onClick={handleResetPassword} bg={'blue'}  >Reset password</Button>
                </Group>
            </Paper>
        </Container>
    );
}