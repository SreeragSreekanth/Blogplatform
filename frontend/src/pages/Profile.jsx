import { useParams } from "react-router-dom";

export default function Profile() {
  const { id } = useParams();
  return <h1>Profile Page of User ID: {id}</h1>;
}
