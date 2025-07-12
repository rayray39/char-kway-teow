import { Button, Stack, TextInput, Title } from "@mantine/core"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

function SignIn() {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [isEmailMissing, setIsEmailMissing] = useState<boolean>(false);
    const [isPasswordMissing, setIsPasswordMissing] = useState<boolean>(false);

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
            </Stack>
        </Stack>
    </>
}

export default SignIn