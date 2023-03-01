import React, { useContext, useState } from 'react'

const UserContext = React.createContext(null);
const UserUpdateContext = React.createContext(null);

export function useUser() {
    return useContext(UserContext)
}

export function useUserUpdate() {
    return useContext(UserUpdateContext)
}

export function UserContextProvider({ children }) {
    const [user, setUser] = useState({ name: '', playerAvatarIndex: null, gameId: null, isHosting: false });

    async function updateUser(name, playerAvatarIndex, gameId, isHosting) {
        await setUser({
            name: name,
            playerAvatarIndex: playerAvatarIndex,
            gameId: gameId,
            isHosting: isHosting
        });
    }

    return (
        <UserContext.Provider value={user}>
            <UserUpdateContext.Provider value={updateUser}>
                {children}
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    )
}