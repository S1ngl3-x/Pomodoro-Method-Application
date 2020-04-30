const axios = require("axios");

const reportService = {
  async saveReport(ownerId, name, values, data, icon) {
    const query = `mutation CreateReport(
  $ownerId: MongoID!,
  $name: String!,
  $data: JSON!,
  $values: [Float]!,
  $icon: String,
){
  reportCreateOne(record: {
    ownerId: $ownerId,
    name: $name,
    data: $data,
    values: $values,
    icon: $icon,
  }){
    record {
    name
    values
    data
    date
    ownerId
    _id
    icon
    }
  }
}`;
    const result = await axios
      .post("graphql", {
        query: query,
        variables: {
          ownerId: ownerId,
          name: name,
          data: data,
          values: values,
          icon: icon
        }
      })
      .catch(reason => console.log(reason));

    return result;
  },

  async loadReports(ownerId) {
    const query = `query ReportsByUser($ownerId: MongoID!){
  reportMany(filter: {ownerId: $ownerId}){
    name
    values
    data
    icon
    date
    ownerId
    _id
  }
}`;

    const result = await axios
      .post("graphql", {
        query: query,
        variables: {
          ownerId: ownerId
        }
      })
      .catch(reason => console.log(reason));

    return result.data.data.reportMany;
  }
};

module.exports = reportService;
