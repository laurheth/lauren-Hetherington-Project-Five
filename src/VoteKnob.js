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
        <div className="voteKnob">
            <p>{props.upvotes}</p>
            {
                <button onClick={(e)=>{vote(e,1)}} disabled={(props.interactedWith[props.voteKey] && props.interactedWith[props.voteKey] >= 1)}>+</button>
            }
            {
                <button onClick={(e)=>{vote(e,-1)}} disabled={(props.interactedWith[props.voteKey] && props.interactedWith[props.voteKey] <= -1)}>-</button>
            }
        </div>
    )
}

export default VoteKnob;