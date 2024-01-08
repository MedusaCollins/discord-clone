import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  imageUrl: String,
  roles: [String],
  status: String
});

const MessageSchema = new mongoose.Schema({
  messageType: String,
  message: String,
  user: UserSchema
});

const AccessSchema = new mongoose.Schema({
  read: [String],
  write: [String]
});

const ChannelSchema = new mongoose.Schema({
  channelID: String,
  name: String,
  type: String,
  access: AccessSchema,
  messages: [MessageSchema]
});

const RoleAccessSchema = new mongoose.Schema({
  manageServer: Boolean,
  manageChannels: Boolean,
  manageRoles: Boolean,
  manageUsers: Boolean,
  manageMessages: Boolean,
  manageVoice: Boolean,
  manageEmojis: Boolean
});

const RoleSchema = new mongoose.Schema({
  name: String,
  color: String,
  access: RoleAccessSchema
});

const logSchema = new mongoose.Schema({
  type: String,
  byWhom: UserSchema,
  toWho: String,
  channel: String,
});
const ServerSchema = new mongoose.Schema({
  serverID: String,
  name: String,
  image: String,
  owner: String,
  logs: [logSchema],
  serverUsers: [UserSchema],
  serverRoles: [RoleSchema],
  channels: [ChannelSchema],
});

const Serverdb = mongoose.model('Server', ServerSchema);
export default Serverdb;