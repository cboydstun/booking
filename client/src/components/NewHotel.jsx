import {useState} from 'react';
import {toast} from 'react-toastify';
import {DatePicker, Select } from 'antd'; 
import {createHotel} from '../Actions/hotel';
import { useSelector } from 'react-redux'; 
import HotelCreateForm from './forms/HotelCreateForm';

const {Option} = Select; //antd design component 


const NewHotel = () => {
    const { auth } = useSelector((state) => ({...state}) ); 
    const { token } = auth; 

    //state
    const [values, setValues] = useState({
        title: '',
        content: '',
        image:'',
        price: '',
        from: '',
        to: '',
        bed: ''
    });
    const [preview, setPreview] = useState('https://via.placeholder.com/100x100.png?text=PREVIEW'); 
    const [location, setLocation] = useState(''); 
    const {title, content, image, price, from, to, bed} = values; 

    //event handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        let hotelData = new FormData();
        hotelData.append('title', title); //key and value
        hotelData.append('content', content);
        hotelData.append('location', location);
        hotelData.append('price', price);
        hotelData.append('title', title);
        image && hotelData.append('image', image);
        hotelData.append('from', from);
        hotelData.append('to', to);
        hotelData.append('bed', bed);
        console.log([...hotelData]);

        try {
            let res = await createHotel(token, hotelData);
            console.log("Hotel create res", res);
            toast.success("New Hotel is Posted");
            setTimeout(() => {
              window.location.reload();
            }, 1000);
        } catch (err) {
            console.log(err);
            toast.error(err.response.data);
       }
    };

    const handleImageChange = (e) => {
        //console.log(e.target.files[0]); 
        setPreview(URL.createObjectURL(e.target.files[0]));
        setValues({...values, image: e.target.files[0]});
    };

    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    };

    return (
      <>
        <div className='container-fluid h2 p-5 text-center'>
          <h2>Add Hotel</h2>
        </div>

        <div className='container-fluid'>
          <div className='row'>
            <div className='col-md-10'>
              <br />
              <HotelCreateForm
                handleChange={handleChange}
                handleImageChange={handleImageChange}
                handleSubmit={handleSubmit}
                location={location}
                setLocation={setLocation}
                setValues={setValues}
                values={values}
              />
            </div>
            <div className='col-md-2'>
              <img
                src={preview}
                alt='preview_image'
                className='img img-fluid m-2'
              />
              Image
              <pre>{JSON.stringify(values, null, 4)}</pre>
              {JSON.stringify(location)}
            </div>
          </div>
        </div>
      </>
    );
}

export default NewHotel; 