import React, { useContext, useState } from 'react'
const SoundOnContext = React.createContext(null);
const SoundUpdateContext = React.createContext(null);

export function useSoundOn() {
    return useContext(SoundOnContext)
}

export function useSoundUpdate() {
    return useContext(SoundUpdateContext)
}

export function SoundContextProvider({ children }) {
    const [soundOn, setSoundOn] = useState(true)

    function toggleSoundOn() {
        setSoundOn(prevSoundOn => !prevSoundOn)
    }

    return (
        <SoundOnContext.Provider value={soundOn}>
            <SoundUpdateContext.Provider value={toggleSoundOn}>
                {children}
            </SoundUpdateContext.Provider>
        </SoundOnContext.Provider>
    )
}