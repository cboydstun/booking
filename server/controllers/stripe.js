import User from '../models/user'; 
import Stripe from 'stripe';
import queryString from 'query-string';

const stripe = Stripe(process.env.STRIPE_SECRET);

export const createConnectAccount = async (req, res) => {
    // find user from DB
    const user = await User.findById(req.user._id).exec();
    // console.log("user", user); 
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


const updateDelayDays = async (accountId) => {
    const account = await stripe.accounts.update(accountId, {
        settings: {
            payouts: {
                schedule :{
                    delay_days: 7,
                },
            },
        },
    });
    return account; 
};

//gives the updated user (minus password, returns new data immediately)
export const getAccountStatus = async (req, res) => {
    //console.log('GET ACCOUNT STATUS');
    const user = await User.findById(req.user._id).exec();
    const account = await stripe.accounts.retrieve(user.stripe_account_id); 
    //console.log(account); 

    //before updating in our database, get update from stripe on delay days
    const updatedAccount = await updateDelayDays(account.id); 

    const updatedUser = await User.findByIdAndUpdate(
        user._id, 
        {
        stripe_seller: updatedAccount,
        },
        { new: true }
    )
    .select('-password')
    .exec();
    //console.log(updatedUser); 
    res.json(updatedUser); 
};

export const getAccountBalance = async(req, res) => {
    const user = await User.findById(req.user._id).exec(); 

    try {
        const balance = await stripe.balance.retrieve({
            stripeAccount: user.stripe_account_id,
        });
        //console.log("Balance ==> ", balance);
        res.json(balance); 
    } catch (err) {
        console.log(err); 
        
    }
}

export const payoutSetting = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).exec();  //query db, get current user

        const loginLink = await stripe.accounts.createLoginLink(
            user.stripe_account_id, 
            {
            redirect_url: process.env.STRIPE_SETTING_REDIRECT_URL
            }
        );
        //console.log("login link for paout settings", loginLink);
        res.json(loginLink); 
    } catch (err) {
        console.log('stripe setting payout error', err); 
    }
}