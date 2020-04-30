exports.SubUserUpdated = email =>
  `subscription SubUserUpdated{
  userUpdated(email: "` +
  email +
  `"){
    email
    date
    pomodoroTime
    breakTime
    bigBreakTime
    validationDate
    _id
    password
  }
}`;
