"use strict";
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
exports.WorkoutAthleteNotMatchError = void 0;
const doc_1 = __importDefault(require("../framework/doc"));
const errors_1 = require("./errors");
class WorkoutConcept {
    constructor() {
        this.workouts = new doc_1.default("workouts");
    }
    create(athlete, type, meter, workoutDate, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const _id = yield this.workouts.createOne({ athlete, type, meter, workoutDate, description });
            return { msg: "Workout successfully created!", workout: yield this.workouts.readOne({ _id }) };
        });
    }
    getWorkoutById(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const workout = yield this.workouts.readOne({ _id });
            if (workout === null) {
                throw new errors_1.NotFoundError(`Workout not found!`);
            }
            return workout;
        });
    }
    getWorkouts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const workouts = yield this.workouts.readMany(query, {
                sort: { workoutDate: -1 },
            });
            return workouts;
        });
    }
    getByAthlete(athlete) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getWorkouts({ athlete });
        });
    }
    update(_id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            this.sanitizeUpdate(update);
            yield this.workouts.updateOne({ _id }, update);
            return { msg: "Workout successfully updated!" };
        });
    }
    delete(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.workouts.deleteOne({ _id });
            return { msg: "Workout deleted successfully!" };
        });
    }
    deleteByAthlete(athlete) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.workouts.deleteMany({ athlete: athlete });
            return { msg: `All '${athlete}''s workouts deleted successfully!` };
        });
    }
    getDailyWorkoutByUser(athlete) {
        return __awaiter(this, void 0, void 0, function* () {
            const workouts = yield this.getWorkouts({ athlete });
            // Group workouts by workoutDate
            const groupedWorkouts = workouts.reduce((acc, workout) => {
                const date = workout.workoutDate;
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(workout);
                return acc;
            }, {});
            // Compute total meters for each day and return the result as a list of objects
            const dailyTotals = Object.keys(groupedWorkouts).map((date) => ({
                date,
                totalMeters: this.compute(groupedWorkouts[date]),
            }));
            return dailyTotals;
        });
    }
    isAthlete(user, _id) {
        return __awaiter(this, void 0, void 0, function* () {
            const workout = yield this.workouts.readOne({ _id });
            if (!workout) {
                throw new errors_1.NotFoundError(`Workout ${_id} does not exist!`);
            }
            if (workout.athlete.toString() !== user.toString()) {
                throw new WorkoutAthleteNotMatchError(user, _id);
            }
        });
    }
    getRecentWeekWorkouts() {
        return __awaiter(this, void 0, void 0, function* () {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            const workouts = yield this.getWorkouts({ workoutDate: { $gte: oneWeekAgo.toISOString().split("T")[0] } });
            return workouts;
        });
    }
    compute(workouts) {
        let totalMeter = 0;
        for (const workout of workouts) {
            if (workout.type === "single") {
                totalMeter += workout.meter * 1.5;
            }
            else if (workout.type === "double/pair") {
                totalMeter += workout.meter * 1.25;
            }
            else if (workout.type === "eight") {
                totalMeter += workout.meter * 1;
            }
            else if (workout.type === "erg") {
                totalMeter += workout.meter * 1;
            }
            else if (workout.type === "bikeerg") {
                totalMeter += workout.meter * 0.45;
            }
            else if (workout.type === "cycling") {
                totalMeter += workout.meter * 0.34;
            }
            else if (workout.type === "lift") {
                totalMeter += workout.meter * 5000;
            }
            else if (workout.type === "swimming") {
                totalMeter += workout.meter * 3;
            }
            else if (workout.type === "running") {
                totalMeter += workout.meter * 1.5;
            }
        }
        return totalMeter;
    }
    sanitizeUpdate(update) {
        // Make sure the update cannot change the athlete.
        const allowedUpdates = ["type", "meter", "description"];
        for (const key in update) {
            if (!allowedUpdates.includes(key)) {
                throw new errors_1.NotAllowedError(`Cannot update '${key}' field!`);
            }
        }
    }
}
exports.default = WorkoutConcept;
class WorkoutAthleteNotMatchError extends errors_1.NotAllowedError {
    constructor(author, _id) {
        super("{0} is not the author of post {1}!", author, _id);
        this.author = author;
        this._id = _id;
    }
}
exports.WorkoutAthleteNotMatchError = WorkoutAthleteNotMatchError;
//# sourceMappingURL=workout.js.map