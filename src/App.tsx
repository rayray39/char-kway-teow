import { Button, Stack, Textarea, Title } from "@mantine/core"
import { useState } from "react"

function App() {
    const [prompt, setPrompt] = useState<string>('');

    const [commitMessage, setCommitMessage] = useState<string>('');

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        console.log('Submit button clicked.');
        console.log(`Prompt: ${prompt}`);

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/generate-commit', {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body: JSON.stringify({ prompt })
            })

            const data = await response.json();

            setCommitMessage(data.modelResponse);
            setIsLoading(false)
            console.log(data.message);
        } catch (error) {
            console.error("Error:", error);
            alert("Error: Failed to generate commit message.");
        }
        
        setPrompt('');
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
                    maxWidth:'40%'
                }}>
                    <Textarea
                        label="Provide a brief summary of your implementation"
                        placeholder="Describe your implementation"
                        autosize 
                        minRows={3}
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                    />

                    <Button variant="default" onClick={handleSubmit} style={{
                        width:'100%',
                        marginBottom:'2rem'
                    }}>Submit</Button>

                    {
                        isLoading ? 'Loading...' : commitMessage
                    }
                </Stack>
            </Stack>
        </>
    )
}

export default App
