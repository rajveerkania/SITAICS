interface PageProps {
  params: {
    id: string;
  };
}

export default function userDetails({ params }: PageProps) {
  return <h1>User Id: {params.id}</h1>;
}
