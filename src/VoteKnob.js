import React from 'react';

function VoteKnob(props) {
    // Apply vote. Also, keep track of interactions in props.interactedWith (passed down from App)
    const vote= (e,delta) => {
        e.preventDefault();
        if (!(props.voteKey in props.interactedWith)) {
            props.interactedWith[props.voteKey]=0;
        }
        props.interactedWith[props.voteKey] += delta;
        props.dbRef.update({
            upvotes:props.upvotes+delta
        })
    }
    return (
        <div className="voteKnob">
            { // disable the up knob if already upvoted
                <button onClick={(e)=>{vote(e,1)}} disabled={(props.interactedWith[props.voteKey] && props.interactedWith[props.voteKey] >= 1)}>+</button>
            }
            <p>{props.upvotes}</p>
            { // disable the down knob if already downvoted
                <button onClick={(e)=>{vote(e,-1)}} disabled={(props.interactedWith[props.voteKey] && props.interactedWith[props.voteKey] <= -1)}>-</button>
            }
        </div>
    )
}

export default VoteKnob;