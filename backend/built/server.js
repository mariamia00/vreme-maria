"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var person_router_1 = require("./person.router");
var cors_1 = __importDefault(require("cors"));
var database_config_1 = require("./database.config");
(0, database_config_1.dbConnect)();
var app = (0, express_1.default)();
var port = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: ["http://localhost:4200"],
}));
app.use(body_parser_1.default.json());
app.use("/api/people", person_router_1.personRouter);
// app.use(express.static(path.join(__dirname, "../../frontend/dist/weather/")));
// Catch-all route to serve Angular's index.html
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../frontend/dist/weather/index.html"));
// });
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
