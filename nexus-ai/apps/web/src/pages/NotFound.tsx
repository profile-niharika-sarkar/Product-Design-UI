import { Link } from 'react-router-dom';
import { Empty } from '../components/StateView';

export function NotFound() {
  return (
    <Empty title="This page doesn’t exist">
      Check the address, or go back to the <Link to="/">overview</Link>.
    </Empty>
  );
}
