import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from './authContext';
import Login from '@/components/Login';

const withAuth = (WrappedComponent: any) => {
    return (props: any) => {
        const { user, loading } = useAuth();

        console.log("user", user)
        if (loading) {
            return <></>
        }
        if (!user) {
            return <Login />
        }

        return <WrappedComponent {...props} user={user} />;
    };
};

export default withAuth;
