import PG from 'pg';

const Pool = PG.Pool;
const pool = new Pool();

export default {
  query: (text, params) => pool.query(text, params),
};
