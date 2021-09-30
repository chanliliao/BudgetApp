import { NavBar } from '../components/NavBar';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Index = () => {
  return (
    <div>
      <NavBar />
      hello world
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
