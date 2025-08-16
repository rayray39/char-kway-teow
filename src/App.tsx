import { Button, CopyButton, Group, Loader, Stack, Textarea, Title, Text } from "@mantine/core"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useColorScheme } from "./utils/ColorSchemeContext";
import { supabase } from "./utils/supabaseClient";

const GIT_COMMIT_MSG_PROMPT = `Format the implementation as a git commit message that follows these rules: the subject line should be capitalized, in the imperative mood, have no ending period, be separated from the body by a blank line, and be wrapped at 72 characters; the body should explain what and why, not how, describing why the change is being made, how it addresses the issue, and what effects it has, including limitations if relevant; avoid assuming the reader knows the original problem or that the code is self-explanatory; do not include patch-set–specific comments; make the first line the most important and impactful. Return only the formatted git commit message and keep it concise.

Follow this structure:
<type>: <description>

[body]

This is the implementation: `;

function App() {
    const navigate = useNavigate();
    
    const [prompt, setPrompt] = useState<string>('');   // user's prompt

    const [commitMessage, setCommitMessage] = useState<string>('');     // generated git commit message

    const [isLoading, setIsLoading] = useState<boolean>(false);     // true if the response from the model is not fetched yet

    const [emptyPromptError, setEmptyPromptError] = useState<boolean>(false);   // true if prompt field is empty on submission

    const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>(false);

    const { dark, toggleColorScheme } = useColorScheme();

    const fetchResponseFromOpenRouter = async (userPrompt:string) => {
        const response = await fetch('http://localhost:5000/openrouter/api/generate-commit', {
            method:'POST',
            headers:{
                'Authorization': `Bearer ${localStorage.getItem('charkwayteow_jwtToken')}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify({ prompt: userPrompt })
        })

        return response;
    }

    const handleSubmit = async () => {
        console.log('Submit button clicked.');
        if (!prompt) {
            console.log('Prompt is empty.');
            setEmptyPromptError(true);
            return;
        }

        console.log(`Prompt: ${prompt}`);

        setIsLoading(true);
        setIsSubmitSuccess(false);

        const promptToModel = GIT_COMMIT_MSG_PROMPT + prompt;

        try {
            let response = await fetchResponseFromOpenRouter(promptToModel);

            if (!response.ok) {
                if (response.status === 403) {
                    const refresh_token = localStorage.getItem("charkwayteow_refreshToken");

                    if (!refresh_token) {
                        throw new Error("No refresh token found. Sign out and sign in again.");
                    }

                    // access token expired, refresh token
                    const { data, error } = await supabase.auth.refreshSession({
                        refresh_token: refresh_token,
                    });

                    if (error) {
                        alert("Current session has expired, please sign in again.");
                        setTimeout(() => {
                            handleSignOut();
                        }, 3000);
                        return;
                    }
                    if (data.session) {
                        // set new access token and refresh token
                        const jwtToken = data.session.access_token;         // jwt token
                        const refreshToken = data.session.refresh_token;    // refresh token
                        localStorage.setItem("charkwayteow_jwtToken", jwtToken);
                        localStorage.setItem("charkwayteow_refreshToken", refreshToken);

                        response = await fetchResponseFromOpenRouter(promptToModel);
                    }
                } else if (response.status === 401) {
                    // token not found
                    alert("Authentication required. If you are already signed in, please sign out and request for a new OTP to sign in again.");
                    return;
                } else {
                    const errorResponse = await response.text();
                    throw new Error(errorResponse);
                }
            }

            const data = await response.json();

            setCommitMessage(data.modelResponse);

            setIsSubmitSuccess(true);
            console.log(data.message);
        } catch (error) {
            alert(`[${error}]: Failed to generate commit message.`);
        } finally {
            setPrompt('');
            setIsLoading(false);
            setEmptyPromptError(false);
        }

        // for testing, simulate fetch
        // setTimeout(() => {
        //     setCommitMessage('dummy data');
        //     setIsLoading(false);
        //     setIsSubmitSuccess(true);
        // }, 2000);
        // getOpenRouterUsageLimits();
    }

    const handleSignOut = async () => {
        // logs the user out and removes the JWT token from local storage
        console.log('signing out...');

        const { error } = await supabase.auth.signOut();

        if (!error) {
            localStorage.removeItem('charkwayteow_jwtToken');
            localStorage.removeItem('charkwayteow_refreshToken');
            console.log('successfully logged out');
            navigate('/');
        }
    }

    // const getOpenRouterUsageLimits = async () => {
    //     // fetches the usage limits from openrouter, credits used and limit will be undefined if using free model
    //     const response = await fetch('http://localhost:5000/openrouter/api/get-usage-limits', {
    //         method:'GET',
    //     })

    //     const data = await response.json();
    //     console.log(data.message);
    // }

    return (
        <>
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
                        width:'40%',
                        marginTop:'10px'
                    }}
                >
                    <Title order={1} >CharKwayTeow🫡</Title>
                    <Title order={4} style={{ fontWeight:'normal' }}>Write git commit messages like a pro✅</Title>
                </Stack>
                    
                <Stack style={{
                    minWidth:'40%'
                }}>
                    <Group 
                        justify="space-between"
                    >
                        <Button variant="default" onClick={handleSignOut}>Sign Out</Button>
                        <Button variant="default" style={{ fontSize:'20px', textAlign:'center' }} onClick={toggleColorScheme}>{dark ? '🌞' : '🌛'}</Button>
                    </Group>

                    <Textarea
                        label="Provide a brief summary of your implementation"
                        placeholder="Describe your implementation"
                        autosize 
                        minRows={3}
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        error={emptyPromptError ? "Input cannot be empty" : null}
                    />

                    <Button variant="default" onClick={handleSubmit} style={{
                        width:'100%',
                        marginBottom:'1rem'
                    }}>Submit</Button>

                    {
                        isLoading ? <Loading /> : (isSubmitSuccess ? <CommitMessage text={commitMessage} /> : null)
                    }

                    <Text size="sm" style={{
                        textAlign:'center',
                        position:'relative',
                        bottom: 0,
                    }}>© rayray39, 2025</Text>

                </Stack>
            </Stack>
        </>
    )
}

function CommitMessage({ text }:{ text:string }) {
    // returns a textarea that contains the generated git commit message.
    const [outputText, setOutputText] = useState<string>(text);

    return <>
        <Textarea
            label='Generated git commit message'
            autosize 
            minRows={5}
            value={outputText}
            onChange={(event) => setOutputText(event.target.value)}
        />

        <CopyButton value={outputText} timeout={1000} >
            {({ copied, copy }) => (
                <Button color='green' variant={copied ? 'light' : 'default'} onClick={copy} >
                    {copied ? 'copied' : 'copy'}
                </Button>
            )}
        </CopyButton>
    </>
}

function Loading() {
    // returns a loading spinner
    return <Group
        gap={'xs'}
        justify="center"
    >
        <Loader size={'sm'}  color="rgba(0, 0, 0, 1)" />
        {'Loading...'}
    </Group>
}

export default App
