var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.json());
const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const ccpPath = path.resolve(
    __dirname,
    "..",
    "..",
    "test-network",
    "organizations",
    "peerOrganizations",
    "org1.example.com",
    "connection-org1.json"
);
const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
const walletPath = path.join(process.cwd(), "wallet");
app.use(cors());

// api for getting information from ledger
//http://localhost:8080/api/queryALLpatient
app.get("/api/queryALLpatient", async function (req, res) {
    try {
        // Create a new file system based wallet for managing identities.

        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });
        const network = await gateway.getNetwork("mychannel");
        const contract = network.getContract("fabcar");
        const result = await contract.evaluateTransaction(
            "queryAllPatientRecord"
        );
        console.log(JSON.parse(result)[0]["Record"]);
        console.log(
            `Transaction has been evaluated, result is: ${result.toString()}`
        );
        res.status(200).json({ response: result.toString() });
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        process.exit(1);
    }
});

//http://localhost:8080/api/querypatient/patientID
app.get("/api/query/:id", async function (req, res) {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });
        const network = await gateway.getNetwork("mychannel");
        const contract = network.getContract("fabcar");
        const result = await contract.evaluateTransaction(
            "querypatient",
            req.params.id
        );
        console.log(
            `Transaction has been evaluated, result is: ${result.toString()}`
        );
        res.status(200).json({ response: result.toString() });
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        res.status(500).json({ error: error });
        process.exit(1);
    }
});

app.post("/api/addpatientrecord/", async function (req, res) {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });
        const network = await gateway.getNetwork("mychannel");
        const contract = network.getContract("fabcar");
        await contract.submitTransaction(
            "createPatientLedger",
            // req.body.deIdentification,
            // req.body.expiryDateTime,
            (clientID = `CLIENT${Date.now()}`),
            (date = new Date())
        );
        console.log("Transaction has been submitted");
        res.send("Transaction has been submitted");
        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
});

// Api for update state
app.post("/api/updatepatientrecord/:id", async function (req, res) {
    try {
        // Create a new file system based wallet for managing identities.

        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("fabcar");
        await contract.submitTransaction(
            "createPatientLedger",
            (date = new Date())
        );
        console.log("Transaction has been submitted");
        res.send("Transaction has been submitted");
        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
});

app.post("/api/upload/:id", async function (req, res) {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("fabcar");
        await contract.submitTransaction(
            "UploadData",
            req.params.id,
            req.body.customerID,
            req.body.numberofFiles,

            req.body.deIdentification,
            (datetime = new Date()),
            (uploadId = `upload-${Date.now()}`)
        );
        console.log("Transaction has been submitted");
        res.send("Transaction has been submitted");
        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
});

app.post("/api/share/:id", async function (req, res) {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");

        // Get the contract from the network.
        const contract = network.getContract("fabcar");
        await contract.submitTransaction(
            "ShareData",
            req.params.id,
            req.body.patientName,
            req.body.expiryDateTime,
            req.body.customerID,
            (shareId = `share-${Date.now()}`)
        );
        console.log("Transaction has been submitted");
        res.send("Transaction has been submitted");
        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
});

app.post("/api/view/:id", async function (req, res) {
    try {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get("appUser");
        if (!identity) {
            console.log(
                'An identity for the user "appUser" does not exist in the wallet'
            );
            console.log("Run the registerUser.js application before retrying");
            return;
        }
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: "appUser",
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork("mychannel");
        // Get the contract from the network.
        const contract = network.getContract("fabcar");
        await contract.submitTransaction(
            "ViewData",
            req.params.id,
            (viewId = `View-${Date.now()}`),
            req.body.patientName,
            req.body.customerID,
            req.body.modality,
            req.body.accession,
            (dateTime = new Date())
        );
        console.log("Transaction has been submitted");
        res.send("Transaction has been submitted @");
        // Disconnect from the gateway.
        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
});

app.listen(8080, () => {
    console.log("server is listing on port 8080");
});
