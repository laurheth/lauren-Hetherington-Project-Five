import React from 'react';
import VoteKnob from './VoteKnob';
import firebase from './firebase';
import Swal from 'sweetalert2'

// Component for a specific question thread
class QuestionThread extends React.Component {
    constructor() {
        super();
        this.state = {
            question: "",
            answers: [],
            answersSortedKeys: [], // sorted array of keys (used to determine switches)
            answerInput: "",
            questionRef: {}
        }
    }

    componentDidMount() {
        // listener for specific question
        const questionRef = firebase.database().ref(this.props.selectedQuestion);
        questionRef.on('value', (snapshot) => {
            const questionObj = snapshot.val();

            const answers=[];
            for (let answer in questionObj.answers) {

                answers.push({
                    answerRef:firebase.database().ref(`${this.props.selectedQuestion}/answers/${answer}`),
                    answerKey: answer,
                    text:questionObj.answers[answer].answer,
                    upvotes:questionObj.answers[answer].upvotes,
                })
            }

            answers.sort((a,b) => b.upvotes - a.upvotes);

            const answersSortedKeys = [];

            answers.forEach((answer,index) => {
              answersSortedKeys.push(answer.answerKey);
              // question key positon changed
              const oldIndex = this.state.answersSortedKeys.indexOf(answer.answerKey);
              if (oldIndex >= 0 && oldIndex !== index) {
                if (oldIndex < index) {
                  answer.moved = 1;
                }
                else {
                  answer.moved = -1;
                }
              }
            });

            console.log(answers);

            this.setState({
                answers: answers,
                answersSortedKeys: answersSortedKeys,
                question: questionObj.question
            })
        });
        // save it for later
        this.setState({
            questionRef: questionRef,
        })
    }

    // remove listener when the thread view is unmounted
    componentWillUnmount() {
        this.state.questionRef.off('value');
    }

    exit = (e) => {
        e.preventDefault();
        this.props.returnFunction();
    }

    inputChange = (event) => {
        this.setState({
            answerInput: event.target.value
        });
    }
    
    // submit an answer
    answerSubmit = (event) => {
        event.preventDefault();
        if (this.state.answerInput !== "") {
            const newAnswer = {
                answer: this.state.answerInput,
                upvotes: 0,
            }
            this.setState({
                answerInput: ""
            })

            // clamp its length
            if (newAnswer.answer.length > 140) {
                newAnswer.answer = newAnswer.answer.substring(0,141);
            }

            const answersRef = firebase.database().ref(`${this.props.selectedQuestion}/answers`);

            answersRef.push(newAnswer);
        } else {
            Swal.fire("Error!", "Please type in an answer!",'error');
        }
    }

    render() {
        return (
            <div>
                <h2>{this.state.question}</h2>
                <ul className="questionThread">
                    {this.state.answers.map((answer,index) => {
                        return (
                            <li key={this.props.selectedQuestion+answer.answerKey+index}
                            className={('moved' in answer) ? 
                                (answer.moved>0 ? 
                                    "moveDown" :
                                    "moveUp")
                                : null}
                            >
                                <p className="textContent answerText">{answer.text}</p>
                                <VoteKnob
                                    dbRef={answer.answerRef}
                                    upvotes={answer.upvotes}
                                    voteKey={this.props.selectedQuestion+answer.answerKey}
                                    interactedWith={this.props.interactedWith}
                                />
                            </li>
                        )
                    })}
                </ul>
                <form 
                    className="answerForm"
                    onSubmit={this.answerSubmit}>
                    <label htmlFor="answerInput">Enter your answer: </label>
                    <input
                        type="text"
                        name="answerInput"
                        id="answerInput"
                        value={this.state.answerInput}
                        onChange={this.inputChange}
                        maxLength="140"
                    />
                    <button type="submit">Provide answer</button>
                </form>
                <button
                    className="returnButton"
                    onClick={this.exit}
                >
                    Return to questions list
                </button>
            </div>
        )
    }
}

export default QuestionThread;