import React from 'react';
import VoteKnob from './VoteKnob';
import firebase from './firebase';

class QuestionThread extends React.Component {
    constructor() {
        super();
        this.state = {
            question: "",
            answers: [],
            answerInput: "",
            questionRef: {}
        }
    }

    componentDidMount() {
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


            this.setState({
                answers: answers,
                question: questionObj.question
            })
        });
        // save it for later
        this.setState({
            questionRef: questionRef,
        })
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

            const answersRef = firebase.database().ref(`${this.props.selectedQuestion}/answers`);

            answersRef.push(newAnswer);
        }
    }

    render() {
        return (
            <div>
                <h2>{this.state.question}</h2>
                <ul>
                    {this.state.answers.map((answer,index) => {
                        return (
                            <li key={this.props.selectedQuestion+index}>
                                <p className="textContent">{answer.text}</p>
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
                <form onSubmit={this.answerSubmit}>
                    <label htmlFor="answerInput">Enter your answer : </label>
                    <input
                        type="text"
                        name="answerInput"
                        id="answerInput"
                        value={this.state.answerInput}
                        onChange={this.inputChange}
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