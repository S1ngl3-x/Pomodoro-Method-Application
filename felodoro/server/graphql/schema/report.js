const { ReportTC, Report } = require("../../database/models/Report");

ReportTC.addResolver({
  kind: "query",
  name: "findManyRestricted",
  args: {
    filter: `input  FilterFindManyReportInput {
      ownerId: MongoID!
    }`
  },
  type: [ReportTC],
  resolve: async ({ args, context }) => {
    return Report.find({ ownerId: args.filter.ownerId }).sort({ date: "desc" });
  }
});

const ReportQuery = {
  reportMany: ReportTC.getResolver("findManyRestricted"),
  reportCount: ReportTC.getResolver("count")

  // reportMany: ReportTC.getResolver('findMany'),

  // reportById: ReportTC.getResolver('findById'),
  // reportByIds: ReportTC.getResolver('findByIds'),
  // reportOne: ReportTC.getResolver('findOne'),
  // reportConnection: ReportTC.getResolver('connection'),
  // reportPagination: ReportTC.getResolver('pagination'),
};

const ReportMutation = {
  reportCreateOne: ReportTC.getResolver("createOne")
  // reportCreateMany: ReportTC.getResolver('createMany'),
  // reportUpdateById: ReportTC.getResolver('updateById'),
  // reportUpdateOne: ReportTC.getResolver('updateOne'),
  // reportUpdateMany: ReportTC.getResolver('updateMany'),
  // reportRemoveById: ReportTC.getResolver('removeById'),
  // reportRemoveOne: ReportTC.getResolver('removeOne'),
  // reportRemoveMany: ReportTC.getResolver('removeMany'),
};

exports.ReportQuery = ReportQuery;
exports.ReportMutation = ReportMutation;
