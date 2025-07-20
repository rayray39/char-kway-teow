import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from './SignIn.tsx';
import PrivateRoute from './PrivateRoute.tsx';
import ColorSchemeProvider from './utils/ColorSchemeContext.tsx';


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MantineProvider defaultColorScheme='light' theme={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <ColorSchemeProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<SignIn />} />
                        <Route path="/app" element={
                            <PrivateRoute>
                                <App />
                            </PrivateRoute>
                        } />
                    </Routes>
                </BrowserRouter>
            </ColorSchemeProvider>
        </MantineProvider>
    </StrictMode>,
)
