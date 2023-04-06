const mongoose = require("mongoose");

const ServerModel = mongoose.Schema({
  id: String,
  language: String,
  prefix: String,
  commands_data: [],
  enabled_events: [String],
  enabled_managers: [String],
  groups: {},
});

const ManagerModel = mongoose.Schema({
  name: String,
  data: Map,
});

module.exports = {
  server: mongoose.model("Servers", ServerModel),
  manager: mongoose.model("Managers", ManagerModel),
};
