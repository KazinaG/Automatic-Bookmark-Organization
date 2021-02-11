let sleepSec = 0.1;
let processList = [];
let isProcessing = false;
let node;
const conf_key = 'configuration';

//#region 
let term = 24;
const termSelections = [
    { display: "None", value: 0, default: false },
    { display: "Short", value: 24, default: true },
    { display: "Middle", value: 168, default: false },
    { display: "Long", value: 720, default: false }
];
//#endregion

//#region 
let decreasePercentage = 0.9;
const decreasePercentageSelections = [
    { display: "None", value: 1.0, default: false },
    { display: "Low", value: 0.9, default: true },
    { display: "Middle", value: 0.5, default: false },
    { display: "High", value: 0.1, default: false }
];
//#endregion

//#region processType
const typeAggregate = 'aggregate';
//#endregion processType