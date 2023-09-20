import React, { Component } from 'react';
import './App.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      taskText: '',
    };
  }

  handleInputChange = (e) => {
    this.setState({ taskText: e.target.value });
  };

  addTask = () => {
    const { tasks, taskText } = this.state;
    if (taskText.trim() === '') return;

    const newTask = { id: Date.now().toString(), text: taskText, deadline: '', completed: false };
    this.setState({
      tasks: [...tasks, newTask],
      taskText: '',
    });
  };

  deleteTask = (id) => {
    const updatedTasks = this.state.tasks.filter((task) => task.id !== id);
    this.setState({ tasks: updatedTasks });
  };

  onDragEnd = (result) => {
    if (!result.destination) return;

    const tasks = [...this.state.tasks];
    const [reorderedTask] = tasks.splice(result.source.index, 1);
    tasks.splice(result.destination.index, 0, reorderedTask);

    this.setState({ tasks });
  };

  handleDeadlineChange = (taskId, deadline) => {
    const updatedTasks = this.state.tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, deadline };
      }
      return task;
    });

    this.setState({ tasks: updatedTasks });
  };

  calculateTimeLeft = (deadline) => {
    if (!deadline) return 'No deadline';

    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - now;

    if (timeDiff <= 0) {
      return 'Deadline passed';
    }

    const daysLeft = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`;
  };

  render() {
    const { tasks, taskText } = this.state;

    return (
      <div className="App">
        <h1>Task Manager</h1>
        <div>
          <input
            type="text"
            placeholder="Add a task"
            value={taskText}
            onChange={this.handleInputChange}
          />
          <button onClick={this.addTask}>Add</button>
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="task-list"
              >
                {tasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id}
                    index={index}
                  >
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="task-container" // Add a new class
                      >
                        <div className="task-content"> {/* Wrap task content in a div */}
                          <span className="task-text">{task.text}</span>
                          <input
                            type="date"
                            className="deadline-input"
                            value={task.deadline}
                            onChange={(e) => this.handleDeadlineChange(task.id, e.target.value)}
                          />
                          <div className="time-left">{this.calculateTimeLeft(task.deadline)}</div>
                        </div>
                        <button
                          className="delete-button"
                          onClick={() => this.deleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}

export default App;
