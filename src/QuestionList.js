import React from 'react';

function QuestionList(props) {
    return (
        <div>
            <form onSubmit={props.questionSubmit}>
            <label htmlFor="questionInput">Enter your question : </label>
            <input type="text" name="questionInput" id="questionInput" value={props.questionInput} onChange={props.inputChange} />
            <button type="submit">Ask Question</button>
            </form>
            <ul>
            {props.questionList.map((question) => {
                return <li key={question.key} onClick={() => props.questionSelect(question.key)} >{question.text}</li>
            })}
            </ul>
        </div>
    )
}

export default QuestionList;