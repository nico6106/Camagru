import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../types/users';

interface Prop {
    user: User | null;
    loginUser: (userData: User | null) => void;
    logoutUser: () => void;
    updateUser: (userData: Partial<User>) => void;
}

export const UserContext = React.createContext<Prop>({
    user: null,
    loginUser: () => {},
    logoutUser: () => {},
    updateUser: () => {},
});

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUser();
    }, []);

	const fetchUser = async () => {
		try {
			const response = await axios.get(`http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/me`, {
				withCredentials: true,
			});
			setUser(response.data.user);
		} catch (error: any) {
		}
	};

    const loginUser = (userData: User | null) => {
        setUser(userData);
    };

    const logoutUser = () => {
        setUser(null);
    };

    const updateUser = (userData: Partial<User>) => {
        setUser((prevUser) => {
            if (prevUser) {
                return { ...prevUser, ...userData };
            }
            return null;
        });
    };

    return (
        <UserContext.Provider
            value={{ user, loginUser, logoutUser, updateUser }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};
