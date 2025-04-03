
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


export const tokenGenerates = (userid, res) => {
    const token = jwt.sign({ userid }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    })

    res.cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
    })

    return token;
}


export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)

}

export const comparePassword = async (password, validPassword) => {

    return await bcrypt.compare(password, validPassword)

}

