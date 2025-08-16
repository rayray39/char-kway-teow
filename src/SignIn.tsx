import { Alert, Button, Group, Loader, Stack, TextInput, Title, Tooltip } from "@mantine/core"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "./utils/ColorSchemeContext";
import { supabase } from "./utils/supabaseClient";

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

    const handleGetOtp = async () => {
        // sends OTP to user's email for input
        console.log('sending otp to email...');

        const { error } = await supabase.auth.signInWithOtp({
            email: email,
        })

        if (error) {
            console.log("Error sending OTP to user's email.");
            return;
        }

        console.log("Successfully sent OTP to user's email.");
    }

    const verifyOtp = async () => {
        // verifies the user's otp
        console.log("Verifying user's OTP.");
        const {
            data,
            error,
        } = await supabase.auth.verifyOtp({
            email: email,
            token: otp,
            type: 'email',
        })
    
        if (error) {
            console.log("Error verifying OTP.");
            return false;
        }

        if (data.session) {
            const jwtToken = data.session.access_token;         // jwt token
            const refreshToken = data.session.refresh_token;    // refresh token
            localStorage.setItem("charkwayteow_jwtToken", jwtToken);
            localStorage.setItem("charkwayteow_refreshToken", refreshToken);
        }
    
        console.log("Successfully verified OTP.");
        return true;
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

        const isOtpVerified = await verifyOtp();    // verifies OTP and issues tokens if valid
        console.log(`is otp verified: ${isOtpVerified}`)
        if (!isOtpVerified) {
            setIsOtpValid(false);
            setIsLoading(false);
            return;
        }

        setTimeout(() => {
            setIsLoading(false)
        }, 1000);

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
                style={{
                    marginTop:'10px'
                }}
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
                    <Tooltip label='Check email for OTP' withArrow arrowPosition="center" arrowSize={4} position="bottom">
                        <Button variant="default" onClick={handleGetOtp} disabled={!email}>Get OTP</Button>
                    </Tooltip>
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