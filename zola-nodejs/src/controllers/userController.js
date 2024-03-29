const User = require("../model/userModel");
const bcrypt = require("bcrypt")

module.exports.register = async (req, res, next) => {
    try {
        const {username, email, phoneNumber, password, fullName} = req.body;
        const usernameCheck = await User.findOne({username});
        if (usernameCheck)
            return res.json({msg: "Tên người dùng đã được sử dụng", status: false});
        const emailCheck = await User.findOne({email})
        if (emailCheck)
            return res.json({msg: "Email này đã được sử dụng", status: false});
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            fullName, 
            phoneNumber,
            password: hashedPassword
        });
        delete user.password;
        return res.json({status: true, user});
    }
    catch(exception) {
        next(exception);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});
        if (!user)
        {
            return res.json({msg: "Sai tên tài khoản hoặc mật khẩu", status: false})
        }
            
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
        {
            return res.json({msg: "Sai tên tài khoản hoặc mật khẩu", status: false})
        }
            
        delete user.password;
        return res.json({status: true, user});
    }
    catch(exception) {
        next(exception);
    }
};

module.exports.setAvatar = async (req, res, next) => { 
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet:true,
            avatarImage
        });
        return res.json({isSet:userData.isAvatarImageSet, image:userData.avatarImage})
    }
    catch (ex) {
        next(ex);
    }
};

module.exports.getAllUsers = async (req, res, next) => { 
    try {
        const users = await User.find({_id: {$ne:req.params.id}}).select([
            "email", 
            "username",
            "phoneNumber", 
            "avatarImage",
            "fullName",
            "_id"
        ]);
        return res.json(users);
    }
    catch(ex) {
        next(ex);
    }
};