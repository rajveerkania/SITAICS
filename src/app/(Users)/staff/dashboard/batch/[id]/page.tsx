interface PageProps {
  params: {
    id: string;
  };
}

export default function userDetails({ params }: PageProps) {
  return <h1>Batch Id: {params.id}</h1>;
}
 