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

  // Assumes there are at least two colors
  interpolateColor(colors, ratio) {
    if (colors.length < 2) {
      throw "Oops. Number of colors expected by interpolateColor is at least 2";
    }

    const colorLenMin1 = colors.length - 1;

    for(let i=0; i< colorLenMin1; i++) {
      if (ratio > 0.99) {
        let lastColor = colors[colors.length-1] ;
        return `rgb(${lastColor.r}, ${lastColor.g}, ${lastColor.b})`;
      }

      if (ratio < (i+1)/colorLenMin1 && ratio >= (i) / colorLenMin1) {
        let distanceToPrevColor = ratio - i / colorLenMin1;
        let prevColor = colors[i];
        let currColor = colors[i+1];

        let red = prevColor.r + (currColor.r - prevColor.r) * distanceToPrevColor * colorLenMin1;
        let green = prevColor.g + (currColor.g - prevColor.g) * distanceToPrevColor * colorLenMin1;
        let blue = prevColor.b + (currColor.b - prevColor.b) * distanceToPrevColor * colorLenMin1;

        return `rgb(${parseInt(red)}, ${parseInt(green)}, ${parseInt(blue)})`;
      }
    }
  },

  debug(state, i) {
    console.log(
      'state.labels[0].listCompletion',
      state.labels[0].listCompletion
    )
    // for(let label of state.labels) {
    // }

    // for(let person of state.people) {
      // console.log(
        // {
          // name: person.name,
          // derivedAvailability: person.derivedAvailability,
          // simAvailability: person.simAvailability
        // }
      // );
    // }
    // for(let todo of state.todos) {
      // let parents = this.findParents(todo, arrows);
      // let parentsCollection = [];
//
      // for (let parent of parents) {
        // parentsCollection.push({
          // tile: parent.title,
          // status: parent.simStatus,
          // doneAt: parent.simDoneAt[i]
        // });
      // }
//
      // console.log(
        // {
          // title: todo.title,
          // status: todo.simStatus,
          // doneAt: todo.simDoneAt[i],
          // parents: parentsCollection
        // }
      // );
    // }

    // debugger;
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

  cumulativeDistributionValueForDate(dateEstimates, dateString, numSims) {
    let tmpDate = new Date((new Date()).toDateString());
    let date = new Date(dateString);
    let cumSum = 0;

    while (tmpDate <= date) {
      this.skipWeekend(tmpDate);
      cumSum += dateEstimates[tmpDate.toDateString()];
      this.updateDateByOneDaySim(tmpDate);
    }

    return cumSum / numSims;
  },

  cumulativeDistribution(dateEstimates, numDaysToShow) {
    let list = [];
    let date = new Date();
    let cumSum = 0;

    for (let i=0; i<numDaysToShow; i++) {
      this.skipWeekend(date);
      cumSum += dateEstimates[date.toDateString()];
      list.push(cumSum);
      this.updateDateByOneDaySim(date);
    }

    return list;
  },

  getListOfDateValuePairs(numDaysToShow, dictDates) {
    let list = [];
    let date = new Date();

    for (let i=0; i<numDaysToShow; i++) {
      this.skipWeekend(date);

      let dateString = date.toDateString();

      list.push({
        dateString,
        value: dictDates[dateString]
      });

      this.updateDateByOneDaySim(date);
    }

    return list;
  },

  getListOfDateStrings(numDaysToShow) {
    let date = new Date();
    let list = [];

    for (let i=0; i<numDaysToShow; i++) {
      this.skipWeekend(date);

      list.push(date.toDateString());

      this.updateDateByOneDaySim(date);
    }

    return list;
  },

  setupSimCounts(numDaysToShow, labelIds) {
    let date = new Date();
    let dict = {};

    for (let i=0; i<numDaysToShow; i++) {
      this.skipWeekend(date);

      dict[date.toDateString()] = 0;

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
