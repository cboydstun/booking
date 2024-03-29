import Hotel from '../models/hotels'; 
import fs from 'fs';

export const create = async (req, res) => {
    try {
        let fields = req.fields;
        let files = req.files;

        let hotel = new Hotel(fields);
        if (files.image) {
            hotel.image.data = fs.readFileSync(files.image.path); //give image path to fn, gives image data
            hotel.image.contentType = files.image.type;
        }

        hotel.save((err, result) => {
            if (err) {
                console.log('saving hotel err', err);
                res.status(400).send("error saving"); 
            }
            res.json(result); //saved hotel in db available in client as a response

        }
    )
            

    } catch (err) {
        console.log(err);
        res.status(400).json({
            err: err.message,
        });
    }
};

export const hotels = async (req, res) => {
    let allHotels = await Hotel.find({})
        .limit(24)
        .select("-image.data")
        .populate('postedBy', '_id name') //returns original data from userSchema via the reference in our HotelSchema
        .exec();
    console.log(allHotels);
    res.json(allHotels); //send hotels to frontEnd
};