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

  useEffect(() => {
    client
      .query({
        query: gql`
          query {
            repository(owner: "reactjs", name: "reactjs.org") {
              issues (first: 10, orderBy: { field: CREATED_AT, direction: DESC }) {
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
  }, []);

  return (
    <div className={styles.container}>
      <header>
        <title>BugsBuddy</title>
        <link rel="icon" href="/favicon.ico" />
      </header>

      <main className={styles.container}>
        <section className={styles.headerWelcome}>
          <h1 className={styles.title}>Welcome to</h1>
          <img className={styles.bugsBuddyLogo} src='../images/logo.jpg' alt='BugsBuddy logo'></img>
        </section> 
        <section > 
          <p className={styles.description}>
            Get started by selecting the following filter
          </p>

          </section>
          <Select
            sx={{        
              width: 250,
              height: 50,
            }}
            defaultValue={1}
          >
            <MenuItem value={1}>All</MenuItem>
            <MenuItem value={2}>Open</MenuItem>
            <MenuItem value={3}>Closed</MenuItem>
          
          </Select>
          <section>
          {issues?.map((issue)=> (
            <div>
              <h2 className={styles.issueTitle}>{issue.node.title} </h2>
              <p className={styles.issueBody}>{issue.node.body}</p>
              <p>{new Date(issue.node.createdAt).toLocaleString()}</p>
              <p>{issue.node.state}</p>
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
