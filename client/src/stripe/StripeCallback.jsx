import { LoadingOutlined } from '@ant-design/icons';
import { useEffect } from 'react'; 
import { useSelector, useDispatch } from 'react-redux'; 
import { getAccountStatus } from '../Actions/stripe';

const StripeCallback = ({ history }) => {
    const { auth } = useSelector((state) => ({...state}));
    const dispatch = useDispatch(); 

    useEffect(() => {
        if(auth && auth.token) accountStatus()

    }, [auth])

    const accountStatus = async () =>{
        try {
            const res = await getAccountStatus(auth.token); 
            console.log('User account status on stripe callback response');
        } catch (err) {
            
        }
    }

    return (  
        <> 
        <div className="d-flex justify-content-center p-5">
            <LoadingOutlined className="display-1 p-5 text-danger" />
        </div>   
       </> 
    );
}
 
export default StripeCallback;