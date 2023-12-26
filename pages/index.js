import { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Select, MenuItem } from "@mui/material";
import styles from '../styles/Home.module.css';

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default function Home() {

  const [issues, setIssues] = useState([]);
  const [stateFilter, setStateFilter] = useState("OPEN");


  useEffect(() => {
    client
      .query({
        query: gql`
          query {
            repository(owner: "reactjs", name: "reactjs.org") {
              issues (first: 10, states: ${stateFilter}, orderBy: { field: CREATED_AT, direction: DESC }) {
                edges {
                  node {
                    title
                    body
                    createdAt
                    state
                  }
                }
              }
            }
          }
        `,
      })
      .then((result) => {
        console.log(result?.data);
        setIssues(result?.data?.repository?.issues?.edges)
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [stateFilter]);

  return (
    <div className={styles.container}>
      <header>
        <title>BugsBuddy</title>
        <link rel="icon" href="/favicon.ico" />
      </header>

      <main className={styles.container}>
        <section className={styles.headerWelcome}>
          <img className={styles.bugsBuddyLogo} src='../images/logo.jpg' alt='BugsBuddy logo'></img>
        </section> 
        <section > 
          <p className={styles.description}>
            Get started by selecting the following filter
          </p>

          </section>
          <Select
            onChange={(e) => setStateFilter(e.target.value)}
            sx={{        
              width: 250,
              height: 50,
            }}
            defaultValue="OPEN"
          >
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="CLOSED">Closed</MenuItem>
          
          </Select>
          <section className={styles.issueDashboard}>
          {issues?.map((issue)=> (
            <div className={styles.issueContainer}>              
              <h3 className={styles.issueTitle}>{issue.node.title} </h3>               
              <p className={styles.issueBody}>{issue.node.body}</p>              
              <p className={styles.issueState} style={{color: issue.node.state === "CLOSED" ? "purple" : "green"}}>{issue.node.state}</p>
              <p className={styles.issueDate}>{new Date(issue.node.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </section>
      </main>

      <footer>
      © {new Date().getFullYear()} George Drakoulakos
      </footer>
    </div>
  );
}
