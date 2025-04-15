import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function DeliveryCard({ id, address, status = 'Pending' }) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Package ID: {id}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Address: {address}</p>
        <p>Status: <strong>{status}</strong></p>
      </CardContent>
    </Card>
  );
}
