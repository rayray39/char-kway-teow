import { Alert, Button, Group, Loader, Stack, TextInput, Title } from "@mantine/core"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "./utils/ColorSchemeContext";

function SignIn() {
    const navigate = useNavigate();

    // for user's email and password
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // client side validation for email and password
    const [isEmailMissing, setIsEmailMissing] = useState<boolean>(false);
    const [isPasswordMissing, setIsPasswordMissing] = useState<boolean>(false);

    // password verification
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { dark, toggleColorScheme } = useColorScheme();

    const handleSignIn = async () => {
        console.log('Signing in...');
        setIsEmailMissing(false);
        setIsPasswordMissing(false);

        if (!email) {
            setIsEmailMissing(true);
            return;
        }
        if (!password) {
            setIsPasswordMissing(true);
            return;
        }

        setIsPasswordValid(true);   // unrender alert component at start
        setIsLoading(true);

        // make call to sign in route on backend
        try {
            const response = await fetch('http://localhost:5000/auth/sign-in', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    email: email,
                    password: password
                })
            })

            if (!response.ok) {
                throw new Error();
            }

            const data = await response.json();
            console.log(data.message);

            localStorage.setItem('jwtToken', data.token);
            setIsPasswordValid(true);
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
        } catch (error) {
            console.log('Failed to sign in: ', error);
            setIsPasswordValid(false);
            setIsLoading(false);
            return;
        }

        navigate('/app');
    }

    return <>
        <Stack
            h={'100vh'}
            justify="flex-start"
            align="center"
            gap="md"
        >
            <Stack 
                gap='xs'
                justify="center"
                align="center"
            >
                <Title order={1} >CharKwayTeow🫡</Title>
                <Title order={4} style={{ fontWeight:'normal' }}>Write git commit messages like a pro✅</Title>
            </Stack>

            <Stack style={{
                minWidth:'40%'
            }}>
                <Group justify="flex-end">
                    <Button variant="default" style={{ fontSize:'20px', textAlign:'center' }} onClick={toggleColorScheme}>{dark ? '🌞' : '🌛'}</Button>
                </Group>

                <TextInput
                    label="Email"
                    placeholder="Enter your email here"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    error={isEmailMissing ? "Email is required" : null}
                />

                <TextInput
                    label="Password"
                    placeholder="Enter your password here"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    error={isPasswordMissing ? "Password is required" : null}
                />

                <Button variant="default" onClick={handleSignIn}>{isLoading ? <Loader color="black" size='sm' /> : "Sign In"}</Button>

                {
                    !isPasswordValid && <Alert 
                            variant="light" 
                            color="red" 
                            radius='lg' 
                            withCloseButton 
                            title="Unsuccessful sign in"
                            onClose={() => (setIsPasswordValid(true))}
                        >
                        Incorrect user credentials!
                    </Alert>
                }
            </Stack>
        </Stack>
    </>
}

export default SignIn