import React from 'react'

const CommentList = ({ comments }) => {
    const renderedComments = comments.map(comment => {
        // default value - approved
        let content = comment.content;

        if (comment.status === 'rejected') {
            content = "This comment has been rejected !";
        } else if (comment.status === 'pending') {
            content = "This comment is awaiting moderation.";
        }

        return <li key={comment.id}>
            {content}
        </li>
    })

    return <ul>
        {renderedComments}
    </ul>
}

export default CommentList;