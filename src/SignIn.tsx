import { Alert, Button, Stack, TextInput, Title } from "@mantine/core"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

function SignIn() {
    const navigate = useNavigate();

    // for user's email and password
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // client side validation for email and password
    const [isEmailMissing, setIsEmailMissing] = useState<boolean>(false);
    const [isPasswordMissing, setIsPasswordMissing] = useState<boolean>(false);

    // password verification
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

    const handleSignIn = () => {
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

        // make call to sign in route on backend
        try {
            
        } catch (error) {
            console.log('Failed to sign in: ', error);
            setIsPasswordValid(false);
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
                <Title order={1} >CharKwayTeow</Title>
                <Title order={4} style={{ fontWeight:'normal' }}>Write git commit messages like a pro</Title>
            </Stack>

            <Stack style={{
                minWidth:'40%'
            }}>
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

                <Button variant="default" onClick={handleSignIn}>Sign In</Button>

                {
                    !isPasswordValid && <Alert 
                            variant="light" 
                            color="red" 
                            radius='lg' 
                            withCloseButton 
                            title="Unsuccessful sign in"
                            onClose={() => setIsPasswordValid(true)}
                        >
                        Incorrect user credentials!
                    </Alert>
                }
            </Stack>
        </Stack>
    </>
}

export default SignIn