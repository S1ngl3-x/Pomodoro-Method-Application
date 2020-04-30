const axios = require("axios");
const { CompleteTask, CompleteTaskNoSub } = require("./../queries/task");

const taskService = {
  sameDay(d1, d2) {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  },

  async loadTasks(user, query) {
    if (user === null) {
      return;
    }
    const owner_id = user._id;

    const result = await axios
      .post("graphql", {
        query: query,
        variables: {
          ownerId: owner_id
        }
      })
      .catch(reason => console.log(reason));

    return result.data.data.taskMany;
  },

  async selectUnassignedTask(task) {
    const _id = task._id;
    const status = "NEW";
    const dateAssigned = new Date();
    const dateFinished = null;
    const selected = true;
    const query = `mutation Renew
($_id: MongoID!,
  $status: EnumTaskStatus,
  $dateAssigned: Date,
  $dateFinished: Date,
  $selected: Boolean)
{
  taskUpdateById(record: {
    _id: $_id,
    status: $status,
    dateAssigned: $dateAssigned,
    dateFinished: $dateFinished,
    selected: $selected,
  }){
    record {
      name
      pomodorosEstimated
      selected
      status
      dateCreated
      dateAssigned
      dateFinished
      ownerId
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
      pomodorosSpentCount
    }
  }
}`;
    const result = await axios
      .post("graphql", {
        query: query,
        variables: {
          _id: _id,
          status: status,
          dateAssigned: dateAssigned,
          dateFinished: dateFinished,
          selected: selected
        }
      })
      .catch(reason => console.log(reason));

    return result.data.data.taskUpdateById.record;
  },

  async determineCurrentTask(tasks) {
    const tempSelectedTasks = tasks.filter(task => task.selected);

    if (tempSelectedTasks.length > 1) {
      throw Error("Multiple tasks selected. This is not valid state!");
    } else if (tempSelectedTasks.length === 0) {
      // select unassigned task
      const possibleUnassignedTasks = tasks.filter(
        task => task.name === "unassigned"
      );
      if (
        possibleUnassignedTasks.length === 0 ||
        possibleUnassignedTasks.length > 1
      )
        throw Error("Multiple unassigned tasks in database!!!");
      let unassignedTask = possibleUnassignedTasks[0];

      // update database
      const changedTask = await taskService.selectUnassignedTask(
        unassignedTask
      );

      return false;
    } else {
      // tempSelectedTasks is now guaranteed to be 1
      return tempSelectedTasks[0];
    }
  },

  user() {
    return JSON.parse(localStorage.getItem("user"));
  },

  async determineCurrentCountdown(selectedTask) {
    let tempSelectedCountdowns = selectedTask.countdowns.filter(
      countdown => countdown.selected
    );

    if (
      tempSelectedCountdowns.length > 1 ||
      tempSelectedCountdowns.length === 0
    ) {
      console.log(tempSelectedCountdowns);
      throw Error(
        "Multiple or zero countdowns selected. This is not valid state!"
      );
    }

    return tempSelectedCountdowns[0];
  },

  async getDailyTasksFromAllTasks(tasks) {
    const today = new Date();
    return tasks.filter(task =>
      taskService.sameDay(new Date(task.dateAssigned), today)
    );
  },

  async getNewDailyTasksFromAllTasks(tasks) {
    const today = new Date();
    return tasks
      .filter(task => taskService.sameDay(new Date(task.dateAssigned), today))
      .filter(t => t.status === "NEW");
  },

  async selectTask(_id) {
    const selected = true;
    const query = `mutation UpdateTaskStatusAndSelection($_id: MongoID!, $selected: Boolean){
  taskUpdateById(record: {
    _id: $_id,
    selected: $selected
    }){
    record{
      _id
      name
      ownerId
      status
      selected
    }
  }
}`;

    const result = await axios
      .post("/graphql", {
        query: query,
        variables: {
          _id: _id,
          selected: selected
        }
      })
      .catch(reason => console.log(reason));
  },

  async deselectTask(task) {
    if (task === null || task === undefined) return true; //no task is selected already

    const _id = task._id;
    const selected = false;
    const query = `mutation UpdateTaskStatusAndSelection($_id: MongoID!, $selected: Boolean){
  taskUpdateByIdNoSub(record: {
    _id: $_id,
    selected: $selected
    }){
    record{
      _id
      name
      ownerId
      status
      selected
    }
  }
}`;
    const result = await axios
      .post("/graphql", {
        query: query,
        variables: {
          _id: _id,
          selected: selected
        }
      })
      .catch(reason => {
        console.log(reason);
        return false;
      });

    return true;
  },

  async changeSelectedTask(_id, tasks) {
    //validation has already happened, so this is safe
    const selectedTask = tasks.filter(task => task.selected === true)[0];

    // if (await this.deselectTask(selectedTask)) {
    if (await taskService.deselectTask(selectedTask)) {
      await taskService.selectTask(_id);
    } else {
      throw Error("Error occurred while setting up new selected task!");
    }
  },

  async completeTask(taskId, selected, tasks) {
    const _id = taskId;
    const newDateFinished = new Date();
    const query = selected ? CompleteTaskNoSub : CompleteTask;

    const result = await axios
      .post("/graphql", {
        query: query,
        variables: {
          id: _id,
          date: newDateFinished
        }
      })
      .catch(reason => console.log(reason));

    if (!selected) return; //completed unselected task

    let newSelectedTaskId;

    for (let task of tasks) {
      if (task._id !== _id) {
        newSelectedTaskId = task._id;
        break;
      }
    }

    await taskService.selectTask(newSelectedTaskId);
  }
};

module.exports = taskService;
