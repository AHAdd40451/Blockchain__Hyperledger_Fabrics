/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

// const FabCar = require("./lib/fabcar");
const PatientRecord = require("./lib/nixaam");

// module.exports.FabCar = FabCar;
module.exports.FabCar = PatientRecord;
module.exports.contracts = [PatientRecord];
