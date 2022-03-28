import { db } from "."
import { User } from "../models";
import bcrypt from 'bcryptjs';

export const checkEmailPassword = async (email: string, password: string) => {
    await db.connect();
    const user = await User.findOne({email}).lean()
    await db.disconnect();
    if(!user) return null;
    if(!bcrypt.compareSync(password, user.password!)) return null;
    const { role, name, _id } = user
    return {
        role,
        name,
        _id,
        email: email.toLowerCase()
    };

}

export const createOauthUser = async (oAuthEmail: string, oAuthName: string) => {
    await db.connect();
    const user = await User.findOne({email: oAuthEmail}).lean();
    if(user) {
        await db.disconnect();
        const { role, _id } = user
        return {
            role,
            name: oAuthName,
            _id,
            email: oAuthEmail.toLowerCase()
        }
    }
    const newUser = await User.create({
        email: oAuthEmail,
        name: oAuthName,
        role: "client",
        password: "@",
    })
    await db.disconnect();

    const { role, _id } = newUser;
    return {
        role,
        name: oAuthName,
        _id,
        email: oAuthEmail.toLowerCase()
    }
}