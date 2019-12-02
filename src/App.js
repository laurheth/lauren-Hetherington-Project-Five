import React from 'react';
import firebase from './firebase';
import QuestionList from './QuestionList';
import QuestionThread from './QuestionThread';

// function App() {
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      questionList: [], // list of question objects
      questionSortedKeys: [], // sorted array of keys (used to determine switches)
      dbRef: {}, // reference for database
      questionInput: "", // current question input
      selectedQuestion: null, // current selected question
      interactedWith: {} // object containing items that have been interacted with
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
          text: questions[key].question,
          upvotes: questions[key].upvotes
        })
      }

      questionList.sort((a,b) => b.upvotes - a.upvotes);

      const questionSortedKeys = [];

      questionList.forEach((question,index) => {
        questionSortedKeys.push(question.key);
        // question key positon changed
        const oldIndex = this.state.questionSortedKeys.indexOf(question.key);
        if (oldIndex >= 0 && oldIndex !== index) {
          if (oldIndex < index) {
            question.moved = 1;
          }
          else {
            question.moved = -1;
          }
        }
      });      

      this.setState({
        questionList: questionList,
        questionSortedKeys: questionSortedKeys
      })

    });
  }

  inputChange = (event) => {
    this.setState({
      questionInput: event.target.value
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
        <header>
          <div className="wrapper">
            <h1>Questionable Questions</h1>
          </div>
        </header>
        <div className="wrapper">
          <main id="main">
            {
              (this.state.selectedQuestion) ? (
                <QuestionThread
                  selectedQuestion={this.state.selectedQuestion}
                  returnFunction={this.selectQuestion}
                  interactedWith={this.state.interactedWith} 
                />
              ) :
              (
                <QuestionList
                  questionList={this.state.questionList}
                  inputChange={this.inputChange}
                  questionSubmit={this.questionSubmit}
                  questionInput={this.state.questionInput}
                  questionSelect={this.selectQuestion}
                  interactedWith={this.state.interactedWith}
                />
              )
            }
          </main>
        </div>
        <footer>
          <div className="wrapper">
            <p>© 2019 Lauren Hetherington</p>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
