exports.taskManyByIdForHome = `query FindTasks($ownerId: MongoID!){
  taskMany(filter: {ownerId: $ownerId, status: "NEW"}) {
    name
    pomodorosEstimated
    selected
    status
    dateAssigned
    _id
    pomodorosSpentCount
        pomodorosSpent {
      date
      timeTotal {
        minutes
      }
    }
    countdowns(sort: DATE_DESC) {
      timeTotal {
        minutes
        seconds
      }
      timeCurrent {
        minutes
        seconds
      }
      selected
      running
      type
      date
      _id
    }
  }
}`;

exports.taskManyByIdForTasks = `query FindTasks($ownerId: MongoID!){
  taskMany(filter: {ownerId: $ownerId}) {
    name
    pomodorosEstimated
    selected
    status
    dateCreated
    dateAssigned
    dateFinished
    ownerId
    _id
    pomodorosSpent {
      date
      timeTotal {
        minutes
      }
    }
    pomodorosSpentCount
        countdowns(sort: DATE_DESC) {
      timeTotal {
        minutes
        seconds
      }
      timeCurrent {
        minutes
        seconds
      }
      selected
      running
      type
      date
      _id
    }
  }
}`;

exports.CompleteTask = `mutation CompleteTask($id: MongoID!, $date: Date){
  taskUpdateById(record: {
    _id: $id,
    status: COMPLETED,
    dateFinished: $date,
    selected: false
  }){
    record{
      _id
      name
      ownerId
      status
      selected
      dateCreated
      dateAssigned
      dateFinished
    }
  }
}`;

exports.CompleteTaskNoSub = `mutation CompleteTaskNoSub($id: MongoID!, $date: Date){
  taskUpdateByIdNoSub(record: {
    _id: $id,
    status: COMPLETED,
    dateFinished: $date,
    selected: false
  }){
    record{
      _id
      name
      ownerId
      status
      selected
      dateCreated
      dateAssigned
      dateFinished
    }
  }
}`;

exports.UpdateTaskStatusAndSelection = `mutation UpdateTaskStatusAndSelection($id: MongoID!, $status: EnumTaskStatus, $selected: Boolean){
  taskUpdateById(record: {
    _id: $id,
    status: $status,
    selected: $selected}){
    record{
      _id
      name
      ownerId
      status
      selected
    }
  }
}`;

exports.UpdateTaskStatusAndSelectionNoSub = `mutation UpdateTaskStatusAndSelectionNoSub($id: MongoID!, $status: EnumTaskStatus, $selected: Boolean){
  taskUpdateByIdNoSub(record: {
    _id: $id,
    status: $status,
    selected: $selected}){
    record{
      _id
      name
      ownerId
      status
      selected
    }
  }
}`;

exports.SubTaskCreateForTasks = _id =>
  `subscription SubTaskCreateForTasks{
  taskCreated(ownerId: "` +
  _id +
  `"){
        name
    pomodorosEstimated
    selected
    status
    dateCreated
    dateAssigned
    dateFinished
    ownerId
    _id
    pomodorosSpent {
      date
      timeTotal {
        minutes
      }
    }
    pomodorosSpentCount
  }
}`;

exports.SubTaskCreateForHome = _id =>
  `
subscription SubTaskCreateForHome{
  taskCreated(ownerId: "` +
  _id +
  `"){
    name
    pomodorosEstimated
    selected
    status
    dateAssigned
    _id
    pomodorosSpentCount
        pomodorosSpent {
      date
      timeTotal {
        minutes
      }
    }
    countdowns {
      timeTotal {
        minutes
        seconds
      }
      timeCurrent {
        minutes
        seconds
      }
      selected
      running
      type
      date
      _id
    }
  }
}`;

exports.SubTaskUpdateForTasks = _id =>
  `subscription SubTaskUpdateForTasks{
  taskUpdated (ownerId: "` +
  _id +
  `"){
    name
    pomodorosEstimated
    selected
    status
    dateCreated
    dateAssigned
    dateFinished
    ownerId
    _id
    pomodorosSpent {
      timeTotal {
        minutes
      }
    }
    pomodorosSpentCount
  }
}`;

exports.SubTaskUpdateForHome = _id =>
  `subscription SubTaskUpdateForHome{
  taskUpdated (ownerId: "` +
  _id +
  `"){
    name
    pomodorosEstimated
    selected
    status
    dateAssigned
    _id
    countdowns {
      timeTotal {
        minutes
        seconds
      }
      timeCurrent {
        minutes
        seconds
      }
      selected
      running
      type
      date
      _id
    }
    pomodorosSpent {
      timeTotal {
        minutes
      }
      date
    }
    pomodorosSpentCount
  }
}`;

exports.AllTasksForReports = `query AllTasks($ownerId: MongoID!){
  taskMany(filter: {ownerId: $ownerId}){
    name
    pomodorosEstimated
    selected
    status
    dateCreated
    dateAssigned
    dateFinished
    ownerId
    _id
    countdowns{
      timeTotal {
        minutes
        seconds
        _id
      }
      timeCurrent {
        minutes
        seconds
        _id
      }
      selected
      running
      type
      date
      ownerId
      _id
    }
    pomodorosSpent {
      date
      timeTotal {
        minutes
      }
    }
    pomodorosSpentCount
  }
}`;
