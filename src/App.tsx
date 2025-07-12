import { Button, CopyButton, Group, Loader, Stack, Textarea, Title } from "@mantine/core"
import { useState } from "react"

function App() {
    const [prompt, setPrompt] = useState<string>('');   // user's prompt

    const [commitMessage, setCommitMessage] = useState<string>('');     // generated git commit message

    const [isLoading, setIsLoading] = useState<boolean>(false);     // true if the response from the model is not fetched yet

    const [emptyPromptError, setEmptyPromptError] = useState<boolean>(false);   // true if prompt field is empty on submission

    const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>(false);

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
        try {
            const response = await fetch('http://localhost:5000/api/generate-commit', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ prompt })
            })

            const data = await response.json();

            setCommitMessage(data.modelResponse);
            setIsLoading(false);
            setIsSubmitSuccess(true);
            console.log(data.message);
        } catch (error) {
            console.error("Error:", error);
            alert("Error: Failed to generate commit message.");
        }

        setPrompt('');
        setEmptyPromptError(false);
    }

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
                >
                    <Title order={1} >CharKwayTeow</Title>
                    <Title order={4} style={{ fontWeight:'normal' }}>Write git commit messages like a pro</Title>
                </Stack>
                    
                <Stack style={{
                    minWidth:'40%'
                }}>
                    <Textarea
                        label="Provide a brief summary of your implementation"
                        placeholder="Describe your implementation"
                        autosize 
                        minRows={3}
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        error={emptyPromptError ? "Field cannot be empty" : null}
                    />

                    <Button variant="default" onClick={handleSubmit} style={{
                        width:'100%',
                        marginBottom:'2rem'
                    }}>Submit</Button>

                    {
                        isLoading ? <Loading /> : (isSubmitSuccess ? <CommitMessage text={commitMessage} /> : null)
                    }

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

        <CopyButton value={outputText}>
            {({ copied, copy }) => (
                <Button color='green' variant={copied ? 'light' : 'default'} onClick={copy}>
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
