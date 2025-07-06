import { useParams } from 'react-router-dom';

export const ClientDetails = () => {
  const { id } = useParams();

  // Fetch and display client details using `id`
  return <div>Client Details Page for ID: {id}</div>;
};
