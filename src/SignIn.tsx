import { Alert, Button, Group, Loader, Stack, TextInput, Title } from "@mantine/core"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "./utils/ColorSchemeContext";

function SignIn() {
    const navigate = useNavigate();

    // for user's email and otp
    const [email, setEmail] = useState<string>('');
    const [otp, setOtp] = useState<string>('');

    // client side validation for email and otp
    const [isEmailMissing, setIsEmailMissing] = useState<boolean>(false);
    const [isOtpMissing, setIsOtpMissing] = useState<boolean>(false);

    // otp verification
    const [isOtpValid, setIsOtpValid] = useState<boolean>(true);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { dark, toggleColorScheme } = useColorScheme();

    const handleGetOtp = () => {
        // sends OTP to user's email for input
        console.log('sending otp to email...');
    }

    const handleSignIn = async () => {
        // signs the user via JWT, which will be stored in local storage.
        console.log('Signing in...');
        setIsEmailMissing(false);
        setIsOtpMissing(false);

        if (!email) {
            setIsEmailMissing(true);
            return;
        }
        if (!otp) {
            setIsOtpMissing(true);
            return;
        }

        setIsOtpValid(true);   // unrender alert component at start
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
                    password: otp
                })
            })

            if (!response.ok) {
                throw new Error();
            }

            const data = await response.json();
            console.log(data.message);

            localStorage.setItem('jwtToken', data.token);   // auth router will return JWT token
            setIsOtpValid(true);
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
        } catch (error) {
            console.log('Failed to sign in: ', error);
            setIsOtpValid(false);
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
                    autoFocus
                />

                <TextInput
                    label="OTP"
                    placeholder="Enter your OTP here"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    error={isOtpMissing ? "OTP is required" : null}
                />

                <Group
                    justify="space-between"
                    grow
                >
                    <Button variant="default" onClick={handleGetOtp} disabled={!email}>Get OTP</Button>
                    <Button variant="default" onClick={handleSignIn}>{isLoading ? <Loader color="black" size='sm' /> : "Sign In"}</Button>
                </Group>

                {
                    !isOtpValid && <Alert 
                            variant="light" 
                            color="red" 
                            radius='lg' 
                            withCloseButton 
                            title="Unsuccessful sign in"
                            onClose={() => (setIsOtpValid(true))}
                        >
                        Incorrect user credentials!
                    </Alert>
                }
            </Stack>
        </Stack>
    </>
}

export default SignIn