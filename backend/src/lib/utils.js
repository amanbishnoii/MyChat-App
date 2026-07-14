import jwt from 'jsonwebtoken';

const isProduction = process.env.NODE_ENV === 'production';
const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    path: '/',
};

export const generateToken = (userid,res) => {
   const tooken= jwt.sign({userid}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
res.cookie('JWT',tooken, cookieOptions);
return tooken;
}