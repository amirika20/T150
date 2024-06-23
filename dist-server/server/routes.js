"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const router_1 = require("./framework/router");
const responses_1 = __importDefault(require("./responses"));
let Routes = (() => {
    var _a;
    let _instanceExtraInitializers = [];
    let _getSessionUser_decorators;
    let _getUsers_decorators;
    let _getUser_decorators;
    let _searchUsersByUsername_decorators;
    let _createUser_decorators;
    let _updateUser_decorators;
    let _deleteUser_decorators;
    let _logIn_decorators;
    let _logOut_decorators;
    let _getWorkouts_decorators;
    let _createWorkout_decorators;
    let _updateWorkout_decorators;
    let _deleteWorkout_decorators;
    let _getDailyWorkouts_decorators;
    let _getMeter_decorators;
    let _getMeterByUser_decorators;
    let _getAllMeter_decorators;
    let _postPR_decorators;
    let _getPRs_decorators;
    let _getPRsByUsername_decorators;
    return _a = class Routes {
            getSessionUser(session) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = app_1.WebSession.getUser(session);
                    return yield app_1.User.getUserById(user);
                });
            }
            getUsers() {
                return __awaiter(this, void 0, void 0, function* () {
                    const users = yield app_1.User.getUsers();
                    return users;
                });
            }
            getUser(username) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield app_1.User.getUserByUsername(username);
                    return user;
                });
            }
            searchUsersByUsername(username) {
                return __awaiter(this, void 0, void 0, function* () {
                    let users;
                    if (username) {
                        users = yield app_1.User.searchUsersByUsername(username);
                    }
                    else {
                        users = yield app_1.User.getUsers();
                    }
                    return users;
                });
            }
            createUser(session, username, password, profilePhoto, code, side) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log("here");
                    app_1.WebSession.isLoggedOut(session);
                    const user = yield app_1.User.create(username, password, profilePhoto, code, side);
                    yield app_1.Meter.create(user.user.username);
                    return user.user;
                });
            }
            updateUser(session, update) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = app_1.WebSession.getUser(session);
                    return yield app_1.User.update(user, update);
                });
            }
            deleteUser(session) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = app_1.WebSession.getUser(session);
                    yield app_1.Workout.deleteByAthlete(user);
                    const username = (yield app_1.User.getUserById(user)).username;
                    yield app_1.PR.deleteByRower(username);
                    yield app_1.Meter.delete(username);
                    yield app_1.PR.deleteByRower(username);
                    app_1.WebSession.end(session);
                    return yield app_1.User.delete(user);
                });
            }
            logIn(session, username, password) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log("Loggin");
                    const u = yield app_1.User.authenticate(username, password);
                    app_1.WebSession.start(session, u._id);
                    return { msg: "Logged in!" };
                });
            }
            logOut(session) {
                return __awaiter(this, void 0, void 0, function* () {
                    app_1.WebSession.end(session);
                    return { msg: "Logged out!" };
                });
            }
            // Workouts
            getWorkouts(athlete) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log(athlete);
                    let workouts;
                    if (athlete) {
                        const id = (yield app_1.User.getUserByUsername(athlete))._id;
                        workouts = yield app_1.Workout.getByAthlete(id);
                    }
                    else {
                        workouts = yield app_1.Workout.getWorkouts({});
                    }
                    return responses_1.default.workouts(workouts);
                });
            }
            createWorkout(session, type, meter, workoutDate, description) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = app_1.WebSession.getUser(session);
                    const created = yield app_1.Workout.create(user, type, Number(meter), workoutDate, description);
                    // Updating meters
                    const username = (yield app_1.User.getUserById(user)).username;
                    const workouts = yield app_1.Workout.getByAthlete(user);
                    yield app_1.Meter.update(username, workouts);
                    return { msg: created.msg, post: yield responses_1.default.workout(created.workout) };
                });
            }
            updateWorkout(session, _id, update) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = app_1.WebSession.getUser(session);
                    yield app_1.Workout.isAthlete(user, _id);
                    yield app_1.Workout.update(_id, update);
                    // Updating meters
                    const username = (yield app_1.User.getUserById(user)).username;
                    const workouts = yield app_1.Workout.getByAthlete(user);
                    yield app_1.Meter.update(username, workouts);
                    return;
                });
            }
            deleteWorkout(session, _id) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = app_1.WebSession.getUser(session);
                    yield app_1.Workout.isAthlete(user, _id);
                    // Updating meters
                    const deleted = yield app_1.Workout.delete(_id);
                    const username = (yield app_1.User.getUserById(user)).username;
                    const workouts = yield app_1.Workout.getByAthlete(user);
                    yield app_1.Meter.update(username, workouts);
                    return { msg: deleted.msg };
                });
            }
            getDailyWorkouts(username) {
                return __awaiter(this, void 0, void 0, function* () {
                    const id = (yield app_1.User.getUserByUsername(username))._id;
                    return yield app_1.Workout.getDailyWorkoutByUser(id);
                });
            }
            getMeter(session) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = app_1.WebSession.getUser(session);
                    const username = (yield app_1.User.getUserById(user)).username;
                    const meter = app_1.Meter.getMeterByRower(username);
                    return meter;
                });
            }
            getMeterByUser(username) {
                return __awaiter(this, void 0, void 0, function* () {
                    const meter = app_1.Meter.getMeterByRower(username);
                    return meter;
                });
            }
            getAllMeter() {
                return __awaiter(this, void 0, void 0, function* () {
                    return app_1.Meter.getMeters({});
                });
            }
            postPR(session, type, date, pr) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = app_1.WebSession.getUser(session);
                    const username = (yield app_1.User.getUserById(user)).username;
                    const created = yield app_1.PR.addOrUpdate(username, type, date, Number(pr));
                    return created;
                });
            }
            getPRs(type) {
                return __awaiter(this, void 0, void 0, function* () {
                    const prs = yield app_1.PR.getPRsByType(type);
                    return prs;
                });
            }
            getPRsByUsername(username) {
                return __awaiter(this, void 0, void 0, function* () {
                    const prs = yield app_1.PR.getByRower(username);
                    return prs;
                });
            }
            constructor() {
                __runInitializers(this, _instanceExtraInitializers);
            }
        },
        (() => {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _getSessionUser_decorators = [router_1.Router.get("/session")];
            _getUsers_decorators = [router_1.Router.get("/users")];
            _getUser_decorators = [router_1.Router.get("/users/:username")];
            _searchUsersByUsername_decorators = [router_1.Router.get("/users/search/:username")];
            _createUser_decorators = [router_1.Router.post("/users")];
            _updateUser_decorators = [router_1.Router.patch("/users")];
            _deleteUser_decorators = [router_1.Router.delete("/users")];
            _logIn_decorators = [router_1.Router.post("/login")];
            _logOut_decorators = [router_1.Router.post("/logout")];
            _getWorkouts_decorators = [router_1.Router.get("/workouts")];
            _createWorkout_decorators = [router_1.Router.post("/workouts")];
            _updateWorkout_decorators = [router_1.Router.patch("/workouts/:_id")];
            _deleteWorkout_decorators = [router_1.Router.delete("/workouts/:_id")];
            _getDailyWorkouts_decorators = [router_1.Router.get("/workouts/daily/:username")];
            _getMeter_decorators = [router_1.Router.get("/meter")];
            _getMeterByUser_decorators = [router_1.Router.get("/meter/:username")];
            _getAllMeter_decorators = [router_1.Router.get("/ranking")];
            _postPR_decorators = [router_1.Router.post("/prs/:type")];
            _getPRs_decorators = [router_1.Router.get("/prs/ranking/:type")];
            _getPRsByUsername_decorators = [router_1.Router.get("/prs/:username")];
            __esDecorate(_a, null, _getSessionUser_decorators, { kind: "method", name: "getSessionUser", static: false, private: false, access: { has: obj => "getSessionUser" in obj, get: obj => obj.getSessionUser }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getUsers_decorators, { kind: "method", name: "getUsers", static: false, private: false, access: { has: obj => "getUsers" in obj, get: obj => obj.getUsers }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getUser_decorators, { kind: "method", name: "getUser", static: false, private: false, access: { has: obj => "getUser" in obj, get: obj => obj.getUser }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _searchUsersByUsername_decorators, { kind: "method", name: "searchUsersByUsername", static: false, private: false, access: { has: obj => "searchUsersByUsername" in obj, get: obj => obj.searchUsersByUsername }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createUser_decorators, { kind: "method", name: "createUser", static: false, private: false, access: { has: obj => "createUser" in obj, get: obj => obj.createUser }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updateUser_decorators, { kind: "method", name: "updateUser", static: false, private: false, access: { has: obj => "updateUser" in obj, get: obj => obj.updateUser }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _deleteUser_decorators, { kind: "method", name: "deleteUser", static: false, private: false, access: { has: obj => "deleteUser" in obj, get: obj => obj.deleteUser }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _logIn_decorators, { kind: "method", name: "logIn", static: false, private: false, access: { has: obj => "logIn" in obj, get: obj => obj.logIn }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _logOut_decorators, { kind: "method", name: "logOut", static: false, private: false, access: { has: obj => "logOut" in obj, get: obj => obj.logOut }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getWorkouts_decorators, { kind: "method", name: "getWorkouts", static: false, private: false, access: { has: obj => "getWorkouts" in obj, get: obj => obj.getWorkouts }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _createWorkout_decorators, { kind: "method", name: "createWorkout", static: false, private: false, access: { has: obj => "createWorkout" in obj, get: obj => obj.createWorkout }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updateWorkout_decorators, { kind: "method", name: "updateWorkout", static: false, private: false, access: { has: obj => "updateWorkout" in obj, get: obj => obj.updateWorkout }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _deleteWorkout_decorators, { kind: "method", name: "deleteWorkout", static: false, private: false, access: { has: obj => "deleteWorkout" in obj, get: obj => obj.deleteWorkout }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getDailyWorkouts_decorators, { kind: "method", name: "getDailyWorkouts", static: false, private: false, access: { has: obj => "getDailyWorkouts" in obj, get: obj => obj.getDailyWorkouts }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getMeter_decorators, { kind: "method", name: "getMeter", static: false, private: false, access: { has: obj => "getMeter" in obj, get: obj => obj.getMeter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getMeterByUser_decorators, { kind: "method", name: "getMeterByUser", static: false, private: false, access: { has: obj => "getMeterByUser" in obj, get: obj => obj.getMeterByUser }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getAllMeter_decorators, { kind: "method", name: "getAllMeter", static: false, private: false, access: { has: obj => "getAllMeter" in obj, get: obj => obj.getAllMeter }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _postPR_decorators, { kind: "method", name: "postPR", static: false, private: false, access: { has: obj => "postPR" in obj, get: obj => obj.postPR }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getPRs_decorators, { kind: "method", name: "getPRs", static: false, private: false, access: { has: obj => "getPRs" in obj, get: obj => obj.getPRs }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _getPRsByUsername_decorators, { kind: "method", name: "getPRsByUsername", static: false, private: false, access: { has: obj => "getPRsByUsername" in obj, get: obj => obj.getPRsByUsername }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.default = (0, router_1.getExpressRouter)(new Routes());
//# sourceMappingURL=routes.js.map