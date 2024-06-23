import { ObjectId } from "mongodb";

import { User, WebSession, Workout, Meter, PR } from "./app";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import { WorkoutDoc } from "concepts/workout";
import { Router, getExpressRouter } from "./framework/router";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    const users = await User.getUsers();
    return users;
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    const user = await User.getUserByUsername(username);
    return user;
  }

  @Router.get("/users/search/:username")
  async searchUsersByUsername(username?: string) {
    let users;
    if (username) {
      users = await User.searchUsersByUsername(username);
    } else {
      users = await User.getUsers();
    }
    return users;
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string, profilePhoto: string, code: string, side: string) {
    console.log("here");
    WebSession.isLoggedOut(session);
    const user = await User.create(username, password, profilePhoto, code, side);
    await Meter.create(user.user.username);
    return user.user;
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    await Workout.deleteByAthlete(user);
    const username = (await User.getUserById(user)).username;
    await PR.deleteByRower(username);
    await Meter.delete(username);
    await PR.deleteByRower(username);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    console.log("Loggin");
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  // Workouts
  @Router.get("/workouts")
  async getWorkouts(athlete?: string) {
    console.log(athlete);
    let workouts;
    if (athlete) {
      const id = (await User.getUserByUsername(athlete))._id;
      workouts = await Workout.getByAthlete(id);
    } else {
      workouts = await Workout.getWorkouts({});
    }
    return Responses.workouts(workouts);
  }

  @Router.post("/workouts")
  async createWorkout(session: WebSessionDoc, type: string, meter: string, workoutDate: string, description: string) {
    const user = WebSession.getUser(session);
    const created = await Workout.create(user, type, Number(meter), workoutDate, description);
    // Updating meters
    const username = (await User.getUserById(user)).username;
    const workouts = await Workout.getByAthlete(user);
    await Meter.update(username, workouts);
    return { msg: created.msg, post: await Responses.workout(created.workout) };
  }

  @Router.patch("/workouts/:_id")
  async updateWorkout(session: WebSessionDoc, _id: ObjectId, update: Partial<WorkoutDoc>) {
    const user = WebSession.getUser(session);
    await Workout.isAthlete(user, _id);
    await Workout.update(_id, update);
    // Updating meters
    const username = (await User.getUserById(user)).username;
    const workouts = await Workout.getByAthlete(user);
    await Meter.update(username, workouts);
    return;
  }

  @Router.delete("/workouts/:_id")
  async deleteWorkout(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Workout.isAthlete(user, _id);
    // Updating meters
    const deleted = await Workout.delete(_id);
    const username = (await User.getUserById(user)).username;
    const workouts = await Workout.getByAthlete(user);
    await Meter.update(username, workouts);
    return { msg: deleted.msg };
  }

  @Router.get("/workouts/daily/:username")
  async getDailyWorkouts(username: string) {
    const id = (await User.getUserByUsername(username))._id;
    return await Workout.getDailyWorkoutByUser(id);
  }

  @Router.get("/meter")
  async getMeter(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const username = (await User.getUserById(user)).username;
    const meter = Meter.getMeterByRower(username);
    return meter;
  }

  @Router.get("/meter/:username")
  async getMeterByUser(username: string) {
    const meter = Meter.getMeterByRower(username);
    return meter;
  }

  @Router.get("/ranking")
  async getAllMeter() {
    return Meter.getMeters({});
  }

  @Router.post("/prs/:type")
  async postPR(session: WebSessionDoc, type: string, date: string, pr: string) {
    const user = WebSession.getUser(session);
    const username = (await User.getUserById(user)).username;
    const created = await PR.addOrUpdate(username, type, date, Number(pr));
    return created;
  }

  @Router.get("/prs/ranking/:type")
  async getPRs(type: string) {
    const prs = await PR.getPRsByType(type);
    return prs;
  }

  @Router.get("/prs/:username")
  async getPRsByUsername(username: string) {
    const prs = await PR.getByRower(username);
    return prs;
  }
}

export default getExpressRouter(new Routes());
