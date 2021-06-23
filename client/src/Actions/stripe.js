import axios from 'axios';

export const createConnectAccount = async (token) => 
    await axios.post(`${process.env.REACT_APP_API}/create-connect-account`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    } ); 

//make a req to backend to get updated user account
export const getAccountStatus = async (token) => axios.post(
    `${process.env.REACT_APP_API}/get-account-status`,
{},
{
    headers: {
        Authorization: `Bearer ${token}`
    }
});