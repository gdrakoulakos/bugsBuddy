import React from 'react';
import styles from '../styles/Home.module.css';

const IssueItem = ({ title, body, state, createdAt }) => {
  return (
    <div className={styles.issueContainer}>
      <h3 className={styles.issueTitle}>{title}</h3>
      <p className={styles.issueBody}>{body}</p>
      <p className={styles.issueState} style={{ color: state === 'CLOSED' ? 'purple' : 'green' }}>
        {state}
      </p>
      <p className={styles.issueDate}>{new Date(createdAt).toLocaleString()}</p>
    </div>
  );
};

export default IssueItem;