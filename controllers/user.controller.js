const User = require('../models/User.model.js');
const updateUser = async (req, res) => {
    try{
        const {name, interests} = req.body;
        
        if(!name || !interests){
            return res.status(400).json({error: "Insuffient Data"})
        }

        const id = req.user._id.toString();

        let user = await User.findById(id)

        let newUser = user
        newUser.name = name
        newUser.interests = interests

        user = await User.findByIdAndUpdate(id, { $set: newUser }, { new: true })

        return res.status(200).json(user);
    } catch(error) {
        res.status(400).json({error: "Internal Server error"})
    }
}

module.exports = {updateUser}