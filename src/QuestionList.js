import React from 'react';
import VoteKnob from './VoteKnob';
import firebase from './firebase';

function QuestionList(props) {
    return (
        <div>
            <form onSubmit={props.questionSubmit}>
                <label htmlFor="questionInput">
                    Enter your question :
                </label>
                <input
                    type="text"
                    name="questionInput"
                    id="questionInput"
                    value={props.questionInput}
                    onChange={props.inputChange}
                />
                <button type="submit">
                    Ask Question
                </button>
            </form>
            <ul>
            {props.questionList.map((question) => {
                return (
                <li key={question.key}  >
                    <p
                        className="textContent"
                        >
                        <a
                            href='#'
                            onClick={() => props.questionSelect(question.key)}
                        >
                            {question.text}
                        </a>
                    </p>
                    <VoteKnob
                        dbRef={firebase.database().ref(question.key)}
                        upvotes={question.upvotes}
                        voteKey={question.key}
                        interactedWith={props.interactedWith}
                    />
                </li>
                )
            })}
            </ul>
        </div>
    )
}

export default QuestionList;