import { useAuth } from '@/auth/authContext';
import { ReactNode } from 'react';
interface AuthorizedViewProps {
    children: ReactNode;
}


const AuthorizedView = ({ children }: AuthorizedViewProps) => {
    const { user } = useAuth();

    if (!user) return <></>

    return <>{children}</>;
};

export default AuthorizedView;
