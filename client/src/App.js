import React, { Component } from 'react';
import './App.css';

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

    const newTask = { id: Date.now(), text: taskText, completed: false };
    this.setState({
      tasks: [...tasks, newTask],
      taskText: '',
    });
  };

  deleteTask = (id) => {
    const updatedTasks = this.state.tasks.filter((task) => task.id !== id);
    this.setState({ tasks: updatedTasks });
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
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>
              {task.text}
              <button onClick={() => this.deleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
