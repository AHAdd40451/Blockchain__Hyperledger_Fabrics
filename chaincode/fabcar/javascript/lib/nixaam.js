"use strict";
const { Contract } = require("fabric-contract-api");
class PatientRecord extends Contract {
    async initLedger(ctx) {
        console.info("============= START : Initialize Ledger ===========");
        const patients = [
            {
                date: "12-10-2022",
                Upload: [
                    {
                        CustomerID: "33",
                        NumberofFiles: "10",
                        DeIdentification: false,
                        DateTime: "",
                        UploadId: "",
                    },
                ],
                Share: [
                    {
                        ShareId: "22",
                        PatientName: "Amjad",
                        ExpiryDateTime: "abcDate",
                        CustomerID: "33",
                    },
                ],
                View: [
                    {
                        ViewId: "",
                        PatientName: "Amjad",
                        CustomerID: "33",
                        Modality: "abc date",
                        DateTime: "abc date",
                        Accession: "asdfasdf",
                    },
                ],
            },
        ];

        for (let i = 0; i < patients.length; i++) {
            patients[i].docType = "patientLedger";
            await ctx.stub.putState(
                "CLIENT" + i,
                Buffer.from(JSON.stringify(patients[i]))
            );
            console.info("Added <--> ", patients[i]);
        }
        console.info("============= END : Initialize Ledger ===========");
    }

    async queryAllPatientRecord(ctx) {
        const startKey = "";
        const endKey = "";
        const allResults = [];
        for await (const { key, value } of ctx.stub.getStateByRange(
            startKey,
            endKey
        )) {
            const strValue = Buffer.from(value).toString("utf8");
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async querypatient(ctx, clientID) {
        const patientAsBytes = await ctx.stub.getState(clientID); // get the patient data from chaincode state
        if (!patientAsBytes || patientAsBytes.length === 0) {
            throw new Error(`${clientID} does not exist`);
        }
        console.log(patientAsBytes.toString());
        return patientAsBytes.toString();
    }

    // async Deletequerypatient(ctx, clientID) {
    //     const patientAsBytes = await ctx.stub.getState(clientID); // get the patient data from chaincode state
    //     if (!patientAsBytes || patientAsBytes.length === 0) {
    //         throw new Error(`${clientID} does not exist`);
    //     }
    //     console.log(patientAsBytes.toString());
    //     return ctx.stub.deleteState(clientID);
    // }

    async createPatientLedger(ctx, clientID, date) {
        console.info("============= START : Create patient ledger ===========");

        const patient = {
            docType: "patientLedger",
            date,
            Upload: [],
            Share: [],
            View: [],
        };

        await ctx.stub.putState(clientID, Buffer.from(JSON.stringify(patient)));
        console.info("============= END : Create patient ledger ===========");
    }

    async UploadData(
        ctx,
        id,
        customerID,
        numberofFiles,
        deIdentification,
        datetime,
        uploadId
    ) {
        const exists = await this.RecordExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        const recordString = await this.querypatient(ctx, id);
        const record = JSON.parse(recordString);
        record.Upload.push({
            CustomerID: customerID,
            NumberofFiles: numberofFiles,
            DeIdentification: deIdentification,
            DateTime: datetime,
            UploadId: uploadId,
        });
        // await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(record))));

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(record)));
        console.info("============= END : Create patient ledger ===========");
        return JSON.stringify(record);
    }

    async ShareData(ctx, id, patientName, expiryDateTime, customerID, shareId) {
        const exists = await this.RecordExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        const recordString = await this.querypatient(ctx, id);
        const record = JSON.parse(recordString);
        record.Share.push({
            PatientName: patientName,
            ExpiryDateTime: expiryDateTime,
            CustomerID: customerID,
            ShareId: shareId,
        });
        // await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(record))));

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(record)));
        console.info("============= END : Create patient ledger ===========");
        return JSON.stringify(record);
    }

    async ViewData(
        ctx,
        id,
        viewId,
        patientName,
        customerID,
        modality,
        accession,
        dateTime
    ) {
        const exists = await this.RecordExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        const recordString = await this.querypatient(ctx, id);
        const record = JSON.parse(recordString);
        record.View.push({
            ViewId: viewId,
            PatientName: patientName,
            CustomerID: customerID,
            Modality: modality,
            Accession: accession,
            DateTime: dateTime,
        });
        // await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(record))));

        await ctx.stub.putState(id, Buffer.from(JSON.stringify(record)));
        console.info("============= END : Create patient ledger ===========");
        return JSON.stringify(record);
    }

    // async DeleteRecord(ctx,id){
    //     const exists = await this.RecordExists(ctx, id);
    //     if (!exists) {
    //         throw new Error(`The asset ${id} does not exist`);
    //     }
    //     return ctx.stub.deleteState(id);
    // }

    async RecordExists(ctx, id) {
        const recordJSON = await ctx.stub.getState(id);
        return recordJSON && recordJSON.length > 0;
    }
}

module.exports = PatientRecord;
