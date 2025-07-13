import { useMantineColorScheme } from "@mantine/core";
import { createContext, useContext, useState } from "react";

export const ColorSchemeContext = createContext({
    dark: false,
    toggleColorScheme: () => {}
});

export const useColorScheme = () => useContext(ColorSchemeContext);

function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
    const [dark, setDark] = useState<boolean>(false);
    const { setColorScheme } = useMantineColorScheme();

    const toggleColorScheme = () => {
        // updates the color theme of the app (light, dark)
        if (dark) {
            setColorScheme('light');
            setDark(false);
        } else {
            setColorScheme('dark');
            setDark(true);
        }
    }

    const contextValue = {
        dark,
        toggleColorScheme
    }

    return (
        <ColorSchemeContext.Provider value={contextValue}>
            {children}
        </ColorSchemeContext.Provider>
    )
}

export default ColorSchemeProvider