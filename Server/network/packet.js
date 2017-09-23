let packet_writer = require('dgt-net').packet_writer

let animationId = {
  IDLE: 1,
  WALK: 2,
  HURT: 3,
  ATTACK: 4,
  JUMP: 5,
  FALL: 6,
  DIE: 7,
  DIE_LOOP: 8
}

let packet = {

  ////////////////////////////////////////////////////////////////////////////////
  // Client to Server
  ////////////////////////////////////////////////////////////////////////////////
  CS_CONNECTION: 10001,
  CS_PING: 10002,
  /* 11xxx for Account Access */
  CS_REGISTER: 11010,
  CS_AUTHENTICATION: 11011,
  CS_UPDATE_ACCOUNTDATA: 11012,
  CS_CHECK_CHARACTER_NAME: 11013,
  CS_CREATE_CHARACTER: 11014,
  /* 12xxx for Multiplayer*/
  CS_REQUEST_ENTER_WORLD: 12020,
  CS_SEND_PLAYER_MOVING: 12021,
  CS_EXIT_WORLD: 12022,
  CS_PLAYER_CHANGE_MAP: 12023,
  CS_SEND_PLAYER_STATUS: 12024,
  CS_CHAT: 12101,
  CS_NOTIFICATION: 12102,

  ////////////////////////////////////////////////////////////////////////////////
  // Server to Client
  ////////////////////////////////////////////////////////////////////////////////

  SC_ERROR: 20000,
  SC_CONNETION: 20001,
  SC_PING_SUCCESS: 20002,
  /* 21xxx for Account Access */
  SC_REGISTER_SUCCESS: 21010,
  SC_REGISTER_FAILED: 21011,
  SC_AUTHENTICATION_GRANT: 21012,
  SC_AUTHENTICATION_DENIED: 21013,
  SC_ACCOUN_DATA: 21014,
  SC_CHARACTER_NAME_AVAILABLE: 21015,
  SC_CHARACTER_NAME_ALREADY_USED: 21016,
  SC_CHARACTER_CREATE_SUCCESS: 21017,
  SC_CHARACTER_CREATE_FAILED: 21018,
  /* 22xxx for Multiplayer*/
  SC_MULTIPLAYER_PLAYERS_IN_WORLD: 22020,
  SC_MULTIPLAYER_ENTER_WORLD_GRANT: 22021,
  SC_MULTIPLAYER_ENTER_WORLD_DENIED: 22022,
  SC_ONLINE_PLAYER_CONNECT: 22023,
  SC_ONLINE_PLAYER_CONTROL: 22024,
  SC_ONLINE_PLAYER_DISCONNECT: 22025,
  SC_CHAT: 22026,
  SC_NOTIFICATION: 22027,
};

////////////////////////////////////////////////////////////////////////////////
// Received Packets
////////////////////////////////////////////////////////////////////////////////

packet[packet.CS_CONNECTION] = function (remoteProxy, data) {
  if (!data.completed()) return true;

}

packet[packet.CS_PING] = function (remoteProxy, data) {
  if (!data.completed()) return true;
  remoteProxy.ping(pingTime);
}

packet[packet.CS_REGISTER] = function (remoteProxy, data) {
  let username = data.read_string();
  let password = data.read_string();
  let email = data.read_string();
  let gender = data.read_string();
  if (!data.completed()) return true;
  remoteProxy.registerAccount(username, password, email, gender);
}

packet[packet.CS_AUTHENTICATION] = function (remoteProxy, data) {
  let username = data.read_string();
  let password = data.read_string();
  if (!data.completed()) return true;
  remoteProxy.authentication(username, password);
}

packet[packet.CS_CHECK_CHARACTER_NAME] = function(remoteProxy,data){
  let characterName = data.read_string();
  if (!data.completed()) return true; 
  remoteProxy.checkCharacterName(characterName);
}

packet[packet.CS_UPDATE_ACCOUNTDATA] = function (remoteProxy, data) {
  let color = data.read_uint8();
  let highest_level = data.read_uint16();
  let highest_checkpoint = data.read_uint16();
  if (!data.completed()) return true;
  remoteProxy.updateAccountData(color, highest_level, highest_checkpoint);
}

packet[packet.CS_CREATE_CHARACTER] = function(remoteProxy,data){
  let name = data.read_string();
  let gender = data.read_string();
  let job = data.read_string();
  if(!data.completed()) return true;
  remoteProxy.createCharacter(name,gender,job);
}

packet[packet.CS_SEND_PLAYER_MOVING] = function (remoteProxy, data) {
  let dataSet = {
    UID: data.read_uint32(),
    Position: { x: data.read_float(), y: data.read_float() },
    Velocity: { x: data.read_float(), y: data.read_float() },
    ScaleX: data.read_float(),
    Animation: data.read_uint8()
  }
  let characterData = {};
  if (!data.completed()) return true;
  remoteProxy.submitPlayerControlData(dataSet);
}

packet[packet.CS_REQUEST_ENTER_WORLD] = function (remoteProxy, data) {
  let characterName = data.read_string();  
  if (!data.completed()) return true;
  remoteProxy.playerEnterWorld(characterName);
}

packet[packet.CS_PLAYER_CHANGE_MAP] = function (remoteProxy, data) {
  let mapName = data.read_string();  
  let position = {x:data.read_float(),y:data.read_float()};
  if (!data.completed()) return true;
  remoteProxy.playerChangeMap(mapName,position);
}

packet[packet.CS_SEND_PLAYER_STATUS] = function (remoteProxy, data) {
  let status = {
    Level: data.read_uint8(),
    EXP : data.read_uint16(),
    MaxEXP: data.read_uint16(),
    HP: data.read_uint16(),
    MaxHP: data.read_uint16(),
    SP: data.read_uint16(),
    MaxSP: data.read_uint16(),
    ATK: data.read_uint16(),
    DEF: data.read_uint16()
  }
  if (!data.completed()) return true;
  remoteProxy.updateCharacterStatus(status);
}

packet[packet.CS_EXIT_WORLD] = (remoteProxy, data) => {
  remoteProxy.playerExitWorld();
}

packet[packet.CS_CHAT] = function (remoteProxy, data) {
  let msg = data.read_string();
  if (!data.completed()) return true;

}

packet[packet.CS_NOTIFICATION] = function (remoteProxy, data) {
  let notification = data.read_string();
  if (!data.completed()) return true;
  ///remoteProxy.notification(notification);
}

////////////////////////////////////////////////////////////////////////////////
// Send Packets
////////////////////////////////////////////////////////////////////////////////

packet.make_error = function (msg) {
  let o = new packet_writer(packet.SC_ERROR);
  o.append_string(msg);
  o.finish();
  return o.buffer;
}

packet.make_connection = function (msg) {
  let o = new packet_writer(packet.SC_CONNETION);
  //o.append_string(msg);
  o.finish();
  return o.buffer;
}

packet.make_ping_success = function () {
  let o = new packet_writer(packet.SC_PING_SUCCESS);
  o.finish();
  return o.buffer;
}

packet.make_authentication_grant = function (uid, color, highest_level, highest_checkpoint) {
  let o = new packet_writer(packet.SC_AUTHENTICATION_GRANT);
  o.finish();
  return o.buffer;
}

packet.make_register_success = (username) => {
  let o = new packet_writer(packet.SC_REGISTER_SUCCESS);
  o.append_string(username);
  o.finish();
  return o.buffer;
}

packet.make_register_failed = (errCode, msg) => {
  let o = new packet_writer(packet.SC_REGISTER_FAILED);
  o.append_int8(errCode);
  o.append_string(msg);
  o.finish();
  return o.buffer;
}

packet.make_authentication_denied = (errCode, msg) => {
  let o = new packet_writer(packet.SC_AUTHENTICATION_DENIED);
  o.append_uint8(errCode);
  o.append_string(msg);
  o.finish()
  return o.buffer;
}

packet.make_account_data = (data) => {
  let o = new packet_writer(packet.SC_ACCOUN_DATA);
  o.append_int32(data._id); // accountID  
  if (data.Characters) {
    o.append_int8(data.Characters.length); // Length of Character
    for (let i = 0; i < data.Characters.length; i++) { // Append data for each character      
      let character = data.Characters[i];
      o = convertCharacterDataToPacketData(o,character);
    }
  } else {
    o.append_int8(0); // don't have any Character
  }
  o.finish();
  return o.buffer;
}

packet.make_character_name_available = ()=>{
  let o =new packet_writer(packet.SC_CHARACTER_NAME_AVAILABLE);
  o.finish();
  return o.buffer; 
}

packet.make_character_name_already_used = function(){
  let o = new packet_writer(packet.SC_CHARACTER_NAME_ALREADY_USED);
  o.finish();
  return o.buffer;
}

packet.make_character_create_success = function(character){
  let o =new packet_writer(packet.SC_CHARACTER_CREATE_SUCCESS);
  o = convertCharacterDataToPacketData(o, character);
  o.finish();
  return o.buffer;
}

packet.make_character_create_failed = function(){
  let o =new packet_writer(packet.SC_CHARACTER_CREATE_FAILED);
  o.finish();
  return o.buffer;
}

packet.make_multiplayer_enter_world_grant = function(){
  let o =new packet_writer(packet.SC_MULTIPLAYER_ENTER_WORLD_GRANT);
  o.finish();
  return o.buffer;
}

packet.make_multiplayer_enter_world_denied = function(){
  let o =new packet_writer(packet.SC_MULTIPLAYER_ENTER_WORLD_DENIED);
  o.finish();
  return o.buffer;
}

packet.make_multiplayer_connect = function (uid, character) {
  let o = new packet_writer(packet.SC_ONLINE_PLAYER_CONNECT);
  // get data from pure Character
  o.append_uint32(uid);
  o.append_string(character.Name);
  o.append_float(character.Location.Position.x);
  o.append_float(character.Location.Position.y);
  o.append_uint32(character.Status.HP);
  o.append_uint32(character.Status.SP);
  o.append_string(character.Status.Job);
  o.append_uint32(character.Status.Level);
  o.append_uint32(character.Status.Equipment.Head);
  o.append_uint32(character.Status.Equipment.Body);
  o.append_uint32(character.Status.Equipment.Weapon);
  o.finish();
  return o.buffer;
}

packet.make_multiplayer_control = function (datas) {
  let o = new packet_writer(packet.SC_ONLINE_PLAYER_CONTROL);
  o.append_uint16(datas.length); //add length first to tell client before loop
  for (let i = 0; i < datas.length; i++) {
    // UID, Name, HP,SP,Job,Level,Equipment,Position only
    //current : uid, position, velocity, scaleX , animation
    o.append_uint32(datas[i].UID);
    o.append_float(datas[i].Position.x);
    o.append_float(datas[i].Position.y);
    o.append_float(datas[i].Velocity.x);
    o.append_float(datas[i].Velocity.y);
    o.append_float(datas[i].ScaleX);
    o.append_int8(datas[i].Animation);
  }
  o.finish();
  return o.buffer;
}

packet.make_multiplayer_in_same_map = function (players) {
  let o = new packet_writer(packet.SC_MULTIPLAYER_PLAYERS_IN_WORLD);
  //get data from temp
  o.append_uint16(players.length);
  for (let i = 0; i < players.length; i++) {
    o.append_uint32(players[i].UID);
    o.append_string(players[i].CharacterName);
    o.append_float(players[i].Location.Position.x);
    o.append_float(players[i].Location.Position.y);
    o.append_uint32(players[i].HP);
    o.append_uint32(players[i].SP);
    o.append_string(players[i].Job);
    o.append_uint32(players[i].Level);
    o.append_uint32(players[i].Equipment.Head);
    o.append_uint32(players[i].Equipment.Body);
    o.append_uint32(players[i].Equipment.Weapon);
  }
  o.finish();
  return o.buffer;
}

packet.make_multiplayer_disconnect = function (uid) {
  let o = new packet_writer(packet.SC_ONLINE_PLAYER_DISCONNECT);
  o.append_uint32(uid);
  o.finish();
  return o.buffer;
}

packet.make_chat = function (msg) {
  let o = new packet_writer(packet.SC_CHAT);
  o.append_string(msg);
  o.finish();
  return o.buffer;
}
packet.make_notification = function (noti) {
  let o = new packet_writer(packet.SC_NOTIFICATION);
  o.append_string(noti);
  o.finish();
  return o.buffer;
}

////////////////////////////////////////////////////////////////////////////////
// Custom method
////////////////////////////////////////////////////////////////////////////////

function convertCharacterDataToPacketData(packet,character){
  packet.append_string(character.Name);// character name  
  //////////////////////////////////////////      
  ///////////// Status
  packet.append_string(character.Status.Job);  // Job      
  packet.append_int8(character.Status.Level);  // Level
  packet.append_int32(character.Status.EXP);   // EXP
  packet.append_int32(character.Status.HP);    // HP
  packet.append_int32(character.Status.SP);    // SP
  packet.append_int32(character.Status.MaxHP); // Max HP
  packet.append_int32(character.Status.MaxSP); // Max SP
  packet.append_int32(character.Status.ATK);   // ATK
  packet.append_int32(character.Status.DEf);   // DEF
  //////////////////////////////////////////
  // Equipment
  packet.append_int16(character.Status.Equipment.Head);    // HEAD
  packet.append_int16(character.Status.Equipment.Body);    // BODY
  packet.append_int16(character.Status.Equipment.Weapon);  // WEAPON
  //////////////////////////////////////////
  // Location
  packet.append_string(character.Location.Map);  // Current Map
  packet.append_float(character.Location.Position.x);    // X
  packet.append_float(character.Location.Position.y);    // Y
  //////////////////////////////////////////
  // Inventory
  packet.append_int32(character.Inventory.Gold);   // Gold
  if (character.Inventory.Items) { // if have Item
    packet.append_int8(character.Inventory.Items.length); // append length of item
    for (let j = 0; j < character.Inventory.Items.length; j++) {// Append data for each Itme
      let item = character.Inventory.Items[i];
      packet.append_int32(item.ItemId);
      packet.append_int16(item.Amount);
    }
  } else {
    packet.append_int8(0); // don't have any Item
  }
  return packet;
}

////////////////////////////////////////////////////////////////////////////////
// Export Module
////////////////////////////////////////////////////////////////////////////////

module.exports = packet;
