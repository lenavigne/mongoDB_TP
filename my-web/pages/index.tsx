import Head from 'next/head'
import {useState} from 'react';
import Layout from '../components/Layout';
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'

type Props = {
  logs: [Log]
}

type Log = {
  _id: String;
  title: String;
  content: String;
}

export async function getServerSideProps() {
  try {
    //await clientPromise
    // `await clientPromise` will use the default database passed in the MONGODB_URI
    // However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
    //
    // `const client = await clientPromise`
    // `const db = client.db("myDatabase")`
    //
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands
    let response = await fetch('http://localhost:3000/api/getLogs');
    let logs = await response.json();
    return {
      props: { posts: JSON.parse(JSON.stringify(logs)) },
    }
  } catch (e) {
    console.error(e)
  }
}


export default function Logs(props: Props) {
  const [logs, setLogs] = useState<Log[]>(props.logs);

  const handleDeletePost = async (logId: string) => {
    try {
      let response = await fetch(
        "http://localhost:3000/api/deletePost?id=" + logId,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );
      response = await response.json();
      window.location.reload();
    } catch (error) {
      console.log("An error occurred while deleting ", error);
    }
  };
  return (
    <Layout>
      <div className="posts-body">
        <h1 className="posts-body-heading">Added Logs</h1>
        {logs && logs.length > 0 ? (
          <ul className="posts-list">
            {logs.map((log, index) => {
              return (
                <li key={index} className="post-item">
                  <div className="post-item-details">
                    <h2>{log.title}</h2>
  
                    <p>{log.content}</p>
                  </div>
                  <div className="post-item-actions">
                    <a href={`/logs/${log._id}`}>Edit</a>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <h2 className="posts-body-heading">Ooops! No posts added so far</h2>
        )}
      </div>
      <style jsx>
        {`
          .posts-body {
            width: 400px;
            margin: 10px auto;
          }
          .posts-body-heading {
            font-family: sans-serif;
          }
          .posts-list {
            list-style-type: none;
            display: block;
          }
          .post-item {
            width: 100%;
            padding: 10px;
            border: 1px solid #d5d5d5;
          }
          .post-item-actions {
            display: flex;
            justify-content: space-between;
          }
          .post-item-actions a {
            text-decoration: none;
          }
        `}
      </style>
    </Layout>
  );
}