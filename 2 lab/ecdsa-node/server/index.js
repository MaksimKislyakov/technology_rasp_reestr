const keccak256 = require("ethereum-cryptography/keccak.js").keccak256;
const secp256k1 = require("ethereum-cryptography/secp256k1").secp256k1;

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "02a7057b3bb58874ed70a9219fc29821d920752909b69731ee4556cd34a10d4707": 100,
  "03067943b87b515592fa56d1e55dc5a5d49a2385cbd09014e3485881967f32af9e": 50,
  "02dbbf904e5babc906d78c218fc52dee88bd8ca66ec23e20e350744c1bcbd76764": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const transaction = req.body;
  console.log(transaction);

  const { sender, recipient, amount, hexSign } = transaction;

  const senderHash = keccak256(Uint8Array.from(sender));

  const isSigned = secp256k1.verify(hexSign, senderHash, sender);
  console.log("Is signed: ", isSigned);

  if (!isSigned) {
    return res.status(400).send({ message: "Not signed!" });
  }

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    return res.status(400).send({ message: "Not enough funds!" });
  }

  balances[sender] -= amount;
  balances[recipient] += amount;

  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
