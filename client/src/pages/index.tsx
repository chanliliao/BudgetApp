import { NavBar } from '../components/NavBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { useTransactionsQuery } from '../generated/graphql';

const Index = () => {
  const [{ data }] = useTransactionsQuery();

  return (
    <div>
      <NavBar />
      hello world
      {data
        ? data.getTransactions.map((t) => (
            <div key={t._id}> {t.description}</div>
          ))
        : null}
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
