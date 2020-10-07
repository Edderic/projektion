/* jshint esversion: 6 */
var helpers = {
  isInProgressTodoSim(todo) {
    return todo.simStatus == 'In progress';
  },

  isDoneTodoSim(todo) {
    return todo.simStatus == 'Done';
  },

  inProgressTodosSim(todos) {
    return todos.filter((todo) => {
      return this.isInProgressTodoSim(todo);
    });
  },

  doneTodosSim(todos) {
    return todos.filter((todo) => {
      return this.isDoneTodoSim(todo);
    });
  },

  finishTodoSim(todo, date, i) {
    if (todo.simStatus == 'In progress' && todo.simDoneAt[i] == date.toDateString()) {
      todo.simStatus = 'Done';
    }
  },


  todosAllDoneSim(todos) {
    return this.doneTodosSim(todos).length == todos.length;
  },

  numHoursAvailForPersonSim(person, date) {
    return person.simAvailability[date.toDateString()];
  },

  findParents(todo, arrows) {
    let parents = [];

    for (let arrow of arrows) {
      if (arrow.childNode == todo) {
        parents.push(arrow.parentNode);
      }
    }

    return parents;
  },

  getDay(date) {
    return date.toDateString().split(' ')[0];
  },
  isNotStartedTodoSim(todo) {
    return todo.simStatus == 'Not started';
  },

  notStartedTodosSim(todos) {
    return todos.filter((todo) => {
      return this.isNotStartedTodoSim(todo);
    });
  },

  skipWeekend(date) {
    while (this.getDay(date) == 'Sun' || this.getDay(date) == 'Sat') {
      this.updateDateByOneDaySim(date);
    }
  },

  setupSimCounts(numDaysToShow, labelIds) {
    let date = new Date();
    let dict = {};

    for (let labelId of labelIds) {
      dict[labelId] = {};
    }

    for (let i=0; i<numDaysToShow; i++) {
      this.skipWeekend(date);

      for (let labelId of labelIds) {
        dict[labelId][date.toDateString()] = 0;
      }

      this.updateDateByOneDaySim(date);
    }

    return dict;
  },

  startableTodoByPersonSim(person, todo, todoParents, date) {
    return (
      this.isNotStartedTodoSim(todo) &&
      this.todosAllDoneSim(todoParents) &&
      this.numHoursAvailForPersonSim(person, date) > 0
    );
  },

  getRoughDate() {
    return new Date((new Date()).toDateString());
  },

  updateDateByOneDaySim(date) {
    date.setDate(date.getDate() + 1);
  },
  consumeAvailability(date, person, numDaysEstimate) {
    let dateCopy = new Date(date.toDateString());
    let numHoursEstimate = numDaysEstimate * 8; // 8 hours per day
    let availForDay = person.simAvailability[dateCopy.toDateString()];

    while (numHoursEstimate > availForDay) {
      person.simAvailability[dateCopy.toDateString()] = 0;
      numHoursEstimate -= availForDay;
      helpers.updateDateByOneDaySim(dateCopy);
      helpers.skipWeekend(dateCopy);
      availForDay = person.simAvailability[dateCopy.toDateString()];
    }

    person.simAvailability[dateCopy.toDateString()] -= numHoursEstimate;

    return dateCopy;
  },

  startWorkOnTodo(todo, date, person) {
    let numDaysEstimate = this.sampleFromArray(todo.simEstimates);

    let finishDate = this.consumeAvailability(date, person, numDaysEstimate);
    todo.simDoneAt.push(finishDate.toDateString());
    todo.simStatus = 'In progress';
  },

  sampleFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  },
};

export default helpers;
