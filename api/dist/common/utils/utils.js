"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIndentityCode = exports.columnDefToTypeORMCondition = exports.getFullName = exports.convertColumnNotationToObject = exports.formatId = exports.ToBoolean = exports.getEnvPath = exports.round = exports.addHours = exports.getAge = exports.compare = exports.hash = exports.runDbMigrations = exports.getDbConnection = exports.getDbConnectionOptions = exports.toPromise = void 0;
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const class_transformer_1 = require("class-transformer");
const moment_1 = __importDefault(require("moment"));
const toPromise = (data) => {
    return new Promise((resolve) => {
        resolve(data);
    });
};
exports.toPromise = toPromise;
const getDbConnectionOptions = async (connectionName = "default") => {
    const options = await (0, typeorm_1.getConnectionOptions)(process.env.NODE_ENV || "development");
    return Object.assign(Object.assign({}, options), { name: connectionName });
};
exports.getDbConnectionOptions = getDbConnectionOptions;
const getDbConnection = async (connectionName = "default") => {
    return await (0, typeorm_1.getConnection)(connectionName);
};
exports.getDbConnection = getDbConnection;
const runDbMigrations = async (connectionName = "default") => {
    const conn = await (0, exports.getDbConnection)(connectionName);
    await conn.runMigrations();
};
exports.runDbMigrations = runDbMigrations;
const hash = async (value) => {
    return await bcrypt.hash(value, 10);
};
exports.hash = hash;
const compare = async (newValue, hashedValue) => {
    return await bcrypt.compare(hashedValue, newValue);
};
exports.compare = compare;
const getAge = async (birthDate) => {
    const timeDiff = Math.abs(Date.now() - birthDate.getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24) / 365.25);
};
exports.getAge = getAge;
const addHours = (numOfHours, date) => {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
    return date;
};
exports.addHours = addHours;
const round = (number) => {
    return Math.round((number + Number.EPSILON) * 100);
};
exports.round = round;
function getEnvPath(dest) {
    const env = process.env["NODE" + "_ENV"];
    const fallback = path.resolve(`${dest}/.env`);
    const filename = env ? `${env}.env` : "development.env";
    let filePath = path.resolve(`${dest}/${filename}`);
    if (!fs.existsSync(filePath)) {
        filePath = fallback;
    }
    return filePath;
}
exports.getEnvPath = getEnvPath;
function ToBoolean() {
    return (0, class_transformer_1.Transform)((value) => value.obj[value.key]);
}
exports.ToBoolean = ToBoolean;
function formatId(value, args) {
    let s = value + "";
    while (s.length < args) {
        s = "0" + s;
    }
    return s;
}
exports.formatId = formatId;
const convertColumnNotationToObject = (notation, nestedValue) => {
    const object = {};
    let pointer = object;
    notation.split(".").map((key, index, arr) => {
        pointer = pointer[key] = index == arr.length - 1 ? nestedValue : {};
    });
    return object;
};
exports.convertColumnNotationToObject = convertColumnNotationToObject;
const getFullName = (firstName, middleName = "", lastName) => {
    if (middleName && middleName !== "") {
        return `${firstName} ${middleName} ${lastName}`;
    }
    else {
        return `${firstName} ${lastName}`;
    }
};
exports.getFullName = getFullName;
const columnDefToTypeORMCondition = (columnDef) => {
    const conditionMapping = [];
    for (var col of columnDef) {
        if (col.type === "date") {
            if ((0, moment_1.default)(new Date(col.filter), "MMM DD, YYYY", true).isValid() ||
                (0, moment_1.default)(new Date(col.filter), "MMMM DD, YYYY", true).isValid() ||
                (0, moment_1.default)(new Date(col.filter), "YYYY-MM-DD", true).isValid()) {
                conditionMapping.push((0, exports.convertColumnNotationToObject)(col.apiNotation, (0, moment_1.default)(new Date(col.filter), "YYYY-MM-DD")));
            }
        }
        else if (col.type === "date-range") {
            const range = col.filter && col.filter.split(",").length > 0
                ? col.filter.split(",").filter((x) => x)
                : [];
            range[1] = range.length === 1 ? range[0] : range[1];
            if ((0, moment_1.default)(new Date(range[0]), "YYYY-MM-DD", true).isValid() &&
                (0, moment_1.default)(new Date(range[1]), "YYYY-MM-DD", true).isValid()) {
                conditionMapping.push((0, exports.convertColumnNotationToObject)(col.apiNotation, (0, typeorm_1.Between)(range[0], range[1])));
            }
        }
        else if (col.type === "option-yes-no") {
            if (col.filter &&
                col.filter !== "" &&
                ["yes", "no"].some((x) => x.toString().toLowerCase() ===
                    col.filter.toString().toLowerCase().trim())) {
                const value = col.filter.toString().toLowerCase().trim() === "yes";
                conditionMapping.push((0, exports.convertColumnNotationToObject)(col.apiNotation, value));
            }
        }
        else if (col.type === "number-range") {
            const range = col.filter.split("-").map((x) => x === null || x === void 0 ? void 0 : x.trim());
            conditionMapping.push((0, exports.convertColumnNotationToObject)(col.apiNotation, (0, typeorm_1.Between)(range[0], range[1])));
        }
        else if (col.type === "precise") {
            conditionMapping.push((0, exports.convertColumnNotationToObject)(col.apiNotation, col.filter));
        }
        else if (col.type === "not" || col.type === "except") {
            conditionMapping.push((0, exports.convertColumnNotationToObject)(col.apiNotation, (0, typeorm_1.Not)(col.filter)));
        }
        else {
            conditionMapping.push((0, exports.convertColumnNotationToObject)(col.apiNotation, (0, typeorm_1.ILike)(`%${col.filter}%`)));
        }
    }
    const newArr = [];
    for (const item of conditionMapping) {
        const name = Object.keys(item)[0];
        if (newArr.some((x) => x[name])) {
            const index = newArr.findIndex((x) => x[name]);
            const res = Object.keys(newArr[index]).map((key) => newArr[index][key]);
            res.push(item[name]);
            newArr[index] = {
                [name]: Object.assign({}, ...res),
            };
            res.push(newArr[index]);
        }
        else {
            newArr.push(item);
        }
    }
    return Object.assign({}, ...newArr);
};
exports.columnDefToTypeORMCondition = columnDefToTypeORMCondition;
const generateIndentityCode = (id) => {
    return String(id).padStart(6, "0");
};
exports.generateIndentityCode = generateIndentityCode;
//# sourceMappingURL=utils.js.map