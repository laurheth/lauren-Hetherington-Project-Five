import React from 'react';
import './App.css';
import firebase from './firebase';
import QuestionList from './QuestionList';
import QuestionThread from './QuestionThread';

// function App() {
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      questionList: [],
      dbRef: {},
      questionInput: "",
      selectedQuestion: null
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

  selectQuestion = (id=null) => {
    this.setState({
      selectedQuestion: id
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Cleverly Named Questions App</h1>
        {
          (this.state.selectedQuestion) ? (
            <QuestionThread selectedQuestion={this.state.selectedQuestion} returnFunction={this.selectQuestion} />
          ) :
          (
            <QuestionList questionList={this.state.questionList} inputChange={this.inputChange} questionSubmit={this.questionSubmit} questionInput={this.state.questionInput} questionSelect={this.selectQuestion} />
          )
        }
      </div>
    );
  }
}

export default App;
