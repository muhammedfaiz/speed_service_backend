import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import paypal from '@paypal/checkout-server-sdk';
export const generateOtp = ()=>{
    return Math.floor(100000+Math.random()*900000).toString();
}

export const sendOtp = async (email,otp)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
    })
    const mailOptions = {
        from:process.env.GMAIL_USER,
        to:email,
        subject: 'Home Service OTP',
        text: `Your OTP is ${otp},it will be expired in 1 minutes`,
    }
    try{
        await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully');
        return;
    }catch(error){
        console.log(error);
        throw new Error('Error sending otp ',error.message);
    }
}

export const generateAccessToken=(data)=>{
    return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '15m' });
}

export const generateRefreshToken=(data)=>{
    return jwt.sign(data, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export const generateAlphanumericValue=(length=5)=>{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export const sendEmployeeCode=async(data)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
    })
    const mailOptions = {
        from:process.env.GMAIL_USER,
        to:data.email,
        subject: 'Speed Service Employee Code',
        text: `You have been accepted to provide the service,Your employee code is ${data.code}.
        Do not loose the code, you will need to login to provide service with your employee code`,
    }
    try{
        await transporter.sendMail(mailOptions);
        return;
    }catch(error){
        throw new Error('Error sending employee code ',error.message);
    }
}

export const sendResetPassword = async(data)=>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
        },
    })
    const mailOptions = {
        from:process.env.GMAIL_USER,
        to:data.email,
        subject: 'Speed Service reset password',
        text: `Your reset password link is ${data.link}.
        This link will be expired within 15 minutes, quickly reset your password.`,
    }
    try{
        await transporter.sendMail(mailOptions);
        return;
    }catch(error){
        throw new Error('Error sending employee code ',error.message);
    }
}

export const verifyToken = (token)=>{
    return jwt.verify(token, process.env.JWT_SECRET);
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const stripExtension = (key) => key.replace(/\.[^./]+$/, '');
const getExtension = (key) => key.match(/\.([^./]+)$/)?.[1];
const FOLDER = 'speed-service';

export const uploadFile = async(file,fileName)=>{
    try {
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        return await cloudinary.uploader.upload(dataUri, {
            public_id: stripExtension(fileName),
            folder: FOLDER,
            resource_type: 'image',
        });
    } catch (error) {
       console.error('Cloudinary unavailable, skipping image upload:', error.message);
       return null;
    }
}

export const randomName = (file)=>{
    const randomNumber = Math.floor(Math.random() * 10000000);
    return `${randomNumber}_${file.originalname}`;
}

export const getFile = async(image)=>{
    if(!image) return null;
    try {
        return cloudinary.url(`${FOLDER}/${stripExtension(image)}`, { secure: true, format: getExtension(image) });
    } catch (error) {
        console.error('Cloudinary unavailable, skipping image retrieval:', error.message);
        return null;
    }
}

export const removeFile = async(image)=>{
    if(!image) return null;
    try {
        return await cloudinary.uploader.destroy(`${FOLDER}/${stripExtension(image)}`);
    } catch (error) {
        console.error('Cloudinary unavailable, skipping image removal:', error.message);
        return null;
    }
}

const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
export const paypalClient = new paypal.core.PayPalHttpClient(environment);

export const getPaypalRequest = (amount)=>{
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: 'USD',
                    value: amount
                }
            }
        ]
    });
    return request;
}

export const getPaypalCaptureRequest = (orderId)=>{
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    return request;
}

export const refundPayment = async (captureId)=>{
    let request = new paypal.payments.CapturesRefundRequest(captureId);
    request.requestBody({});
    const response = await paypalClient.execute(request);
    return response;
}

export const oneTimeLink = async(user)=>{
    const secret = process.env.JWT_SECRET+user.password;
    const  payload = {
        email:user.email,
        id:user._id
    }
    const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    const link = `http://localhost:5173/reset-password/${user._id}/${token}`;
    return link;
}

export const verifyOneTimeLink = async(token,user)=>{
    const secret = process.env.JWT_SECRET+user.password;
    try {
        const payload = jwt.verify(token,secret);
        if(payload.id === user._id){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        throw new Error("Verification failed");
    }
    
}