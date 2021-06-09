import mongoose from 'mongoose';
import bcrypt from 'bcrypt'; 
const {Schema} = mongoose; 

const userSchema = new Schema({
    name: {
        type: String,
        trim: true, 
        required: 'Name is Required'
    },
    name: {
        type: String,
        trim: true, 
        required: 'Email is Required',
        unique: true
    },
    password: {
        type: String, 
        required: true,
        minLength: 6,
        maxLength: 1024
    },
    stripe_account_id: '',
    stripe_seller: {},
    stripeSession: {}
},
    {timestamps: true}
); 

userSchema.pre('save', function(next) {
    let user = this;
    if(user.isModified('password')){
        return bcrypt.hash(user.password, 12, function (err, hash){
            if(err){
                console.log('BCRYPT HASH ERR', err); 
                return next(err); 
            }
            user.password = hash; 
            return next();
        });
    } else {
        return next(); 
    }
});

export default mongoose.model('User', userSchema); 