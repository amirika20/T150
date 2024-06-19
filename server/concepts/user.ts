import { Filter, ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";
const regCode = process.env.REG_CODE;
if (!regCode) {
  throw new Error("Please add REG_CODE");
}

export interface UserDoc extends BaseDoc {
  username: string;
  password: string;
  profilePhoto: string; // ObjectId maybe?
}

export interface SanitizedUserDoc extends BaseDoc {
  username: string;
  profilePhoto: string; // ObjectId maybe?
}

export default class UserConcept {
  public readonly users = new DocCollection<UserDoc>("users");

  async create(username: string, password: string, profilePhoto: string, code: string) {
    await this.canCreate(username, code);
    const _id = await this.users.createOne({ username: username, password: password, profilePhoto: profilePhoto });
    return { msg: "User created successfully!", user: await this.getUserById(_id) };
  }

  private sanitizeUser(user: UserDoc) {
    // eslint-disable-next-line
    const { password, ...rest } = user; // remove password
    return rest;
  }

  private sanitizeUsers(users: Array<UserDoc>) {
    // eslint-disable-next-line
    return users.map((user) => this.sanitizeUser(user));
  }

  async getUserById(_id: ObjectId) {
    const user = await this.users.readOne({ _id });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    }
    return this.sanitizeUser(user);
  }

  async getUserByUsername(username: string) {
    const user = await this.users.readOne({ username: username });
    if (user === null) {
      throw new NotFoundError(`User not found!`);
    }
    return this.sanitizeUser(user);
  }

  async searchUsersByUsername(username: string) {
    // REGEX SEARCHES FOR USERNAMES THAT MATCH
    let query: Filter<UserDoc> = {};
    if (username) {
      query = { username: { $regex: `${username}`, $options: "i" } };
    } else {
      query = {};
    }
    const users = await this.users.readMany(query);
    if (users === null) {
      throw new NotFoundError(`User not found!`);
    }
    return await this.sanitizeUsers(users);
  }

  async idsToUsernames(ids: ObjectId[]) {
    const users = await this.users.readMany({ _id: { $in: ids } });

    // Store strings in Map because ObjectId comparison by reference is wrong
    const idToUser = new Map(users.map((user) => [user._id.toString(), user]));
    return ids.map((id) => idToUser.get(id.toString())?.username ?? "DELETED_USER");
  }

  async getUsers(username?: string) {
    // If username is undefined, return all users by applying empty filter
    const filter = username ? { username } : {};
    const users = (await this.users.readMany(filter)).map(this.sanitizeUser);
    return users;
  }

  async authenticate(username: string, password: string) {
    const user = await this.users.readOne({ username: username, password: password });
    if (!user) {
      throw new NotAllowedError("Username or password is incorrect.");
    }
    return { msg: "Successfully authenticated.", _id: user._id };
  }

  async update(_id: ObjectId, update: Partial<UserDoc>) {
    if (update.username !== undefined) {
      await this.isUsernameUnique(update.username);
    }
    await this.users.updateOne({ _id }, update);
    return { msg: "User updated successfully!" };
  }

  async delete(_id: ObjectId) {
    await this.users.deleteOne({ _id });
    return { msg: "User deleted!" };
  }

  async userExists(_id: ObjectId) {
    const maybeUser = await this.users.readOne({ _id });
    if (maybeUser === null) {
      throw new NotFoundError(`User not found!`);
    }
  }

  private async canCreate(username: string, code: string) {
    if (!username) {
      throw new BadValuesError("The username cannot be empty");
    }
    if (code !== regCode) {
      throw new NotAllowedError("Not correct passcode");
    }
    await this.isUsernameUnique(username);
  }

  private async isUsernameUnique(username: string) {
    if (await this.users.readOne({ username })) {
      throw new NotAllowedError(`User with username ${username} already exists!`);
    }
  }
}
