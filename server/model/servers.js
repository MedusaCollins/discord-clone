import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  imageUrl: String,
  roles: [String]
});

const MessageSchema = new mongoose.Schema({
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

const ServerSchema = new mongoose.Schema({
  serverID: String,
  name: String,
  image: String,
  channels: [ChannelSchema],
  serverUsers: [UserSchema],
  serverRoles: [RoleSchema]
});

const Serverdb = mongoose.model('Server', ServerSchema);
export default Serverdb;