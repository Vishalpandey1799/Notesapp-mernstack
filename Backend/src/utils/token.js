
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const tokenGenerates = (userid, res) => {
    const token = jwt.sign({ userid }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/"
    })

    return token;
}


export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)

}

export const comparePassword = async (password, validPassword) => {

    return await bcrypt.compare(password, validPassword)

}

