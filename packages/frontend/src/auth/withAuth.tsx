import Loading from '@/components/Loading';
import { useAuth } from './authContext';
import Login from '@/components/Login';

function withAuth(WrappedComponent: any) {
    const AuthWrapper = (props: any) => {
        const { user, loading } = useAuth();
        console.log(user, loading)
        if (loading) {
            return <Loading />
        }
        if (!user) {
            return <Login />
        }

        return <WrappedComponent {...props} user={user} />;
    };
    return AuthWrapper;
};

export default withAuth;
