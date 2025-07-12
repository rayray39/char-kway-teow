import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from './SignIn.tsx';


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SignIn />} />
                    <Route path="/app" element={<App />} />
                </Routes>
            </BrowserRouter>
        </MantineProvider>
    </StrictMode>,
)
