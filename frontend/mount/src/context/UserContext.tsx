import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { User } from '../types/users';
import { UserExport } from '../shared/userExport';

interface Prop {
    user: UserExport | null;
    loginUser: (userData: UserExport | null) => void;
    logoutUser: () => void;
	verifUser: () => void;
    updateUser: (userData: Partial<User>) => void;
}

export const UserContext = React.createContext<Prop>({
    user: null,
    loginUser: () => {},
    logoutUser: () => {},
	verifUser:() => {},
    updateUser: () => {},
});

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState<UserExport | null>(null);

    useEffect(() => {
        fetchUser();
		// eslint-disable-next-line react-hooks/exhaustive-deps
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

	const verifUser = () => {
        fetchUser();
    };

    const loginUser = (userData: UserExport | null) => {
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
            value={{ user, loginUser, logoutUser, verifUser, updateUser }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
};
