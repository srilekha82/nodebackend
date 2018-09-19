//to do environment vairables usage to pick up the correct values
const config = {
  app: {
    port: 8080
  },
  db: {
    development: {
      url: 'mongodb://mongo:27017'
    },
    qa: {
      url: ''
    },
    production: {
      url: ''
    },
    dbName: 'idviceBackend'
  },
  envValues: {
    development: {
      tenantName: "noblemissionsQA",
      clientID: "77938eba-90cf-4a61-8ba3-b75b38910851"
    },
    qa: {
      tenantName: "noblemissionsQA",
      clientID: "77938eba-90cf-4a61-8ba3-b75b38910851"
    },
    production: {
      tenantName: "",
      clientID: ""
    },
    graphClientID: "cab323e3-fa92-49a6-b7fc-d30bb3726bc3",
    graphClientCreds: "Ykk5Omt/LWphf7kCheecJzep7fEb73HtKQuVJUia/lw=",
    policyName: "b2c_1_signupsignin"
  }
};
module.exports = config;