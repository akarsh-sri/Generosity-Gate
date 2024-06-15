"use server"
import Razorpay from "razorpay"
import Payment from "@/app/models/Payment"
import User from "@/app/models/User"
import connectDB from "@/app/db/connectDb"

export const initiate = async (amount, to_user, paymentform) => {
    await connectDB();
    let u = await User.findOne({ username: to_user });
    var instance = new Razorpay({ key_id: u.razorpayid, key_secret: u.razorpaysecret });
    // instance.orders.create({
    //     amount: 50000,
    //     currency: "INR",
    //     receipt: "receipt#1",
    //     notes: {
    //         key1: "value3",
    //         key2: "value2"
    //     }
    // })

    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    }

    let x = await instance.orders.create(options);

    await Payment.create({ iod: x.id, amount: amount, to_user: to_user, name: paymentform.name, message: paymentform.message });

    return x;
}

export const fetchUser = async (username) => {
    await connectDB();
    let u = await User.findOne({ username: username });
    let user = u.toObject({ flattenObjectIds: true });
    return user;
}

export const f = async () => {
    await connectDB();
    let u = await User.find({});
    // let user = u.toObject({ flattenObjectIds: true });
    return u;
}

export const fetchPayment = async (username) => {
    await connectDB();
    let p = await Payment.find({ to_user: username, done: "true" }).sort({ amount: -1 }).lean();
    return p;
}


export const UpdateProfile = async (data, oldusername) => {
    await connectDB();
    let ndata = Object.fromEntries(data);
    if (oldusername !== ndata.username) {
        let u = await User.findOne({ username: ndata.username });
        if (u) {
            return { error: "Error" };
        }
    }
    await User.updateOne({ email: ndata.email }, ndata);
}