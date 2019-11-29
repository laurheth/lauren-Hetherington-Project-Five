import React from 'react';

function VoteKnob(props) {
    const vote= (e,delta) => {
        e.preventDefault();
        if (!(props.voteKey in props.interactedWith)) {
            props.interactedWith[props.voteKey]=0;
        }
        props.interactedWith[props.voteKey] += delta;
        console.log(props.interactedWith);
        props.dbRef.update({
            upvotes:props.upvotes+delta
        })
    }
    return (
        <div>
            {props.upvotes}
            {
                (!props.interactedWith[props.voteKey] || props.interactedWith[props.voteKey] < 1) ? <button onClick={(e)=>{vote(e,1)}}>+</button> : null
            }
            {
                (!props.interactedWith[props.voteKey] || props.interactedWith[props.voteKey] > -1) ? <button onClick={(e)=>{vote(e,-1)}}>-</button> : null
            }
        </div>
    )
}

export default VoteKnob;