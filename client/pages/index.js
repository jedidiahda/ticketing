// import buildClient from '../api/build-client';
// import axios from 'axios';
import Link from 'next/link';

//request on client
const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

//request on server
LandingPage.getInitialProps = async (context, client, currentUser) => {
  // const { data } = await buildClient(context).get('/api/users/currentuser');

  // return data;

  const { data } = await client.get('/api/tickets');
  return { tickets: data };
};

export default LandingPage;
