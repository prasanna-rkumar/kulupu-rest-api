const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const cors = require("cors");

const app = express();
const { ApiPromise, WsProvider } = require('@polkadot/api');
const wsProvider = new WsProvider('wss://rpc.kulupu.corepaper.org/ws');

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});

app.use(cors())


var api;

async function initializeKulupuRPC() {
  api = await ApiPromise.create({ provider: wsProvider });
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

app.get("/members", async (_, res) => {
  const x = (await api.query.council.members())
  var members = []
  for(var i = 0; i < x.length; i ++) {
    var identity = (await api.query.identity.identityOf(x[i].toHuman())).toHuman()
    members.push(identity)
  }
  res.send(members)
});

initializeKulupuRPC()