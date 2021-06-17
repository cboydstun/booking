import User from '../models/user'; 
import Stripe from 'stripe';
import queryString from 'query-string';

const stripe = Stripe(process.env.STRIPE_SECRET);

export const createConnectAccount = async (req, res) => {
    console.log("Outcome of middleware fn expressJwt", req.user)
    console.log("You hit create connect endpoint");
    // find user from DB
    const user = await User.findById(req.user._id).exec();
    console.log("user", user); 
    // if user doesn't have a stripe_account_id, create
    if(!user.stripe_account_id){
        const account = await stripe.accounts.create({
            type: "express"
        });
        console.log("account", account); //stripe returns an account obj. with an id
        user.stripe_account_id = account.id; //set user obj. stripe property to stripe id
        user.save(); //save in db
    }
    // create login link
    let accountLink = await stripe.accountLinks.create({
        account: user.stripe_account_id,
        refresh_url: process.env.STRIPE_REDIRECT_URL,
        return_url: process.env.STRIPE_REDIRECT_URL,//re-direct user after completing stripe onboarding 
        type: 'account_onboarding'
    }); 
    //prefil any info such as email
    accountLink = Object.assign(accountLink, {
        "stripe_user[email]": user.email || undefined,
    });

    //to see the accountLink generated -> console.log("accountLink", accountLink);

    //send link to user
    let link = `${accountLink.url}?${queryString.stringify(accountLink)}`;
    console.log("login link", link);
    
    res.send(link);
    // update payment schedule 
}