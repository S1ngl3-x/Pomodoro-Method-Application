const mongoose = require("mongoose");
const { composeWithMongoose } = require("graphql-compose-mongoose");
const { ReportTC } = require("./Report");
const { TaskTC } = require("./Task");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const Schema = mongoose.Schema;

let UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    immutable: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    immutable: true
  },
  date: {
    type: Date,
    default: new Date(),
    immutable: true
  },
  pomodoroTime: {
    type: Number,
    default: 25
  },
  breakTime: {
    type: Number,
    default: 5
  },
  bigBreakTime: {
    type: Number,
    default: 25
  },
  validationDate: {
    type: Date,
    default: new Date()
  }
});

UserSchema.pre("save", function(next) {
  let user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the plaintext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  return bcrypt.compareSync(candidatePassword, this.password, function(
    err,
    isMatch
  ) {
    if (err) return cb(err);
    return cb(null, isMatch);
  });
};

const User = mongoose.model("User", UserSchema);
const UserTC = composeWithMongoose(User);

exports.User = User;
exports.UserTC = UserTC;

UserTC.addRelation("tasks", {
  resolver: () => TaskTC.getResolver("findMany"),
  prepareArgs: {
    filter: source => ({ ownerId: source._id })
  },
  projection: { _id: true }
});

UserTC.addRelation("reports", {
  resolver: () => ReportTC.getResolver("findMany"),
  prepareArgs: {
    filter: source => ({ ownerId: source._id })
  },
  projection: { _id: true }
});
