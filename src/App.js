import React from 'react';
import './App.css';
import firebase from './firebase';

// function App() {
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      questionList: [],
      dbRef: null,
      questionInput: ""
    }
  }

  componentDidMount() {
    // get database reference and store it in state for future reference
    const dbRef = firebase.database().ref();
    this.setState({
      dbRef: dbRef
    });

    dbRef.on('value', (snapshot) => {
      const questions = snapshot.val();
      console.log('value of questions:',questions);

      const questionList = [];
      for (let key in questions) {
        questionList.push({
          key: key,
          text: questions[key].question
        })
      }

      this.setState({
        questionList: questionList
      })

    });
  }

  inputChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  questionSubmit = (event) => {
    event.preventDefault();
    if (this.state.questionInput !== "") {
      const newQuestion = {
        question: this.state.questionInput,
        upvotes: 0,
        postDate: Date.now(),
        answers: {}
      }
      this.setState({
        questionInput: ""
      })
      this.state.dbRef.push(newQuestion);
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Cleverly Named Questions App</h1>
        <form onSubmit={this.questionSubmit}>
          <label htmlFor="questionInput">Enter your question : </label>
          <input type="text" name="questionInput" id="questionInput" value={this.state.questionInput} onChange={this.inputChange} />
          <button type="submit">Ask Question</button>
        </form>
        <ul>
          {this.state.questionList.map((question) => {
            return <li key={question.key}>{question.text}</li>
          })}
        </ul>
      </div>
    );
  }
}

export default App;
