const { default: mongoose } = require("mongoose");

const blogSchema = mongoose.Schema({
    email: {
        type: String
    },
    title: {
        type: String
    },
    poster: {
        type: String
    },
    description: {
        type: String
    }
});
module.exports=mongoose.model('blog', blogSchema);