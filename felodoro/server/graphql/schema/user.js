const { UserTC, User } = require("../../database/models/User");
const { pubsub, withFilter } = require("../resources/pubsub");
const {
  createUnassignedTask,
  disablePasswordQuery,
  disablePasswordInfoInMutation,
  fireUserUpdated
} = require("../middleware/user");

UserTC.addResolver({
  kind: "query",
  name: "login",
  args: {
    user: `input  LoginInput {
      email: String!,
      password: String!
    }`
  },
  type: UserTC,
  resolve: async ({ args, context }) => {
    const registeredEmail = args.user.email;
    const inputPassword = args.user.password;

    const foundUser = await User.findOne({ email: registeredEmail });
    if (!foundUser) return null;

    const valid = foundUser.comparePassword(inputPassword, function(
      err,
      isMatch
    ) {
      if (err) throw err;
      return isMatch;
    });
    return valid ? foundUser : null;
  }
});

const UserQuery = {
  userById: UserTC.getResolver("findById", [disablePasswordQuery]),
  userCount: UserTC.getResolver("count"),
  login: UserTC.getResolver("login")

  // userByIds: UserTC.getResolver('findByIds'),
  // userOne: UserTC.getResolver('findOne'),
  // userMany: UserTC.getResolver('findMany'),
  // userConnection: UserTC.getResolver('connection'),
  // userPagination: UserTC.getResolver('pagination'),
};

const UserMutation = {
  userCreateOne: UserTC.getResolver("createOne", [createUnassignedTask]),
  // userUpdateById: UserTC.getResolver('updateById', [fireUserUpdated]),
  userUpdateById: UserTC.getResolver("updateById", [
    disablePasswordInfoInMutation,
    fireUserUpdated
  ])

  // userUpdateOne: UserTC.getResolver('updateOne'),
  // userUpdateMany: UserTC.getResolver('updateMany'),
  // userRemoveById: UserTC.getResolver('removeById'),
  // userRemoveOne: UserTC.getResolver('removeOne'),
  // userRemoveMany: UserTC.getResolver('removeMany'),
};

const UserSubscription = {
  userUpdated: {
    type: UserTC,
    description: "Subscribe to User Update",
    // args: {_id: UserTC.getFieldType("_id")},
    // args: {_id: 'String!'},
    args: { email: "String!" },
    resolve: (payload, args, context, info) => payload.userUpdated,
    subscribe: withFilter(
      () => pubsub.asyncIterator("userUpdated"),
      (payload, args) => {
        return payload.userUpdated.email === args.email;
      }
    )
  }
};

exports.UserQuery = UserQuery;
exports.UserMutation = UserMutation;
exports.UserSubscription = UserSubscription;
