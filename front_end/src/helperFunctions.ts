import dotenv from 'dotenv'

dotenv.config()

export const logout = async () => {
    console.log('logout ran')
    try {
        const response = await fetch(process.env.REACT_APP_SERVER_URL + '/logout', {
            method: 'POST',
            credentials: 'include', // Ensures cookies are sent with the request
        });
        if (response.ok) {
            console.log('Logged out successfully');
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};