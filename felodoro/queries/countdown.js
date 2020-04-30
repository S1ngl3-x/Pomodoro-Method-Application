exports.SubCountdownUpdated = _id =>
  `subscription SubCountdownUpdated{
  countdownUpdated(ownerId: "` +
  _id +
  `"){
    _id
    timeCurrent {
      minutes
      seconds
    }
  }
}`;

exports.SubCountdownCreated = _id =>
  `subscription SubCountdownCreated{
  countdownCreated (ownerId: "` +
  _id +
  `") {
    _id
    timeTotal {
      minutes
      seconds
    }
  }
}`;

exports.SubscribeForCountdownGetUpdate = _id =>
  `subscription SubscribeForCountdownGetUpdate{
  countdownGetUpdate (ownerId: "` +
  _id +
  `") {
    ownerId
    _id
  }
}`;

exports.CountdownGetUpdate = _id => `query CountdownGetUpdate{
  countdownGetUpdate {
    selected
    running
    type
    date
    ownerId
    _id
  }
}`;
