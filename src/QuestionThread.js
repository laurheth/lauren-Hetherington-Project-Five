import React from 'react';
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
                    text:questionObj.answers[answer].answer,
                    upvotes:questionObj.answers[answer].upvotes
                })
            }
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

    render() {
        return (
            <div>
                <button onClick={this.exit}>Return to questions list</button>
                <h2>{this.state.question}</h2>
                <ul>
                    {this.state.answers.map((answer,index) => {
                        return (
                            <li key={this.props.selectedQuestion+index}>
                                <p>{answer.text}</p>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}

export default QuestionThread;