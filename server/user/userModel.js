const bcrypt = require('bcrypt');
const userSchema = new MONGOOSE.Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
    },
    email: {
        type: String,
        required: [true, "User email is required"],
    },
    password: {
        type: String,
        required: [true, "User password is required"],
    },
    organization: {
        type: String,
        lowercase: true,
        required: [true, "User organizarion is required"],
    },
    standard: {
        type: String,
        required: [true, "User standard is required"],
    },
    subjects: [{id: {type: String}}]
}, {
        timestamps: true
    });

userSchema.pre('save', function (next) {
    const self = this;
    if (self.isNew) {
        bcrypt.hash(self.password, 10, function (err, hash) {
            if (err) return next(err)
            self.password = hash;
            return next();
        });
    } else {
        return next();
    }
});

userSchema.statics.comparePassword = function(password, userPassword) {
    return bcrypt.compare(password, userPassword);
}

module.exports = MONGOOSE.model('User', userSchema, 'users');
