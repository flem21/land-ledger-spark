import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Home, FileText, Users, Clock } from 'lucide-react';
import { PropertySearch } from './PropertySearch';
import { PropertyRegistration } from './PropertyRegistration';
import { TransactionHistory } from './TransactionHistory';
import { useToast } from '@/hooks/use-toast';

// Mock blockchain data structure
interface Property {
  id: string;
  address: string;
  owner: string;
  area: number;
  propertyType: string;
  registrationDate: string;
  value: number;
  status: 'active' | 'pending' | 'transferred';
  coordinates: { lat: number; lng: number };
  documentHash: string;
}

interface Transaction {
  id: string;
  propertyId: string;
  fromOwner: string;
  toOwner: string;
  timestamp: string;
  value: number;
  status: 'completed' | 'pending' | 'failed';
  blockHash: string;
}

// Mock data
const mockProperties: Property[] = [
  {
    id: '0x1a2b3c4d',
    address: '123 Maple Street, Springfield',
    owner: 'John Smith',
    area: 2500,
    propertyType: 'Residential',
    registrationDate: '2023-01-15',
    value: 450000,
    status: 'active',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    documentHash: '0xabc123def456...'
  },
  {
    id: '0x2e3f4g5h',
    address: '456 Oak Avenue, Springfield',
    owner: 'Sarah Johnson',
    area: 1800,
    propertyType: 'Residential',
    registrationDate: '2023-03-22',
    value: 320000,
    status: 'active',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    documentHash: '0xdef456ghi789...'
  }
];

const mockTransactions: Transaction[] = [
  {
    id: 'tx_001',
    propertyId: '0x1a2b3c4d',
    fromOwner: 'Michael Brown',
    toOwner: 'John Smith',
    timestamp: '2023-01-15T10:30:00Z',
    value: 450000,
    status: 'completed',
    blockHash: '0xblock123...'
  }
];

export const LandRegistry = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [activeTab, setActiveTab] = useState('search');
  const { toast } = useToast();

  const handlePropertyRegistration = (newProperty: Omit<Property, 'id' | 'registrationDate' | 'status' | 'documentHash'>) => {
    const property: Property = {
      ...newProperty,
      id: `0x${Math.random().toString(16).substr(2, 8)}`,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      documentHash: `0x${Math.random().toString(16).substr(2, 16)}...`
    };
    
    setProperties(prev => [...prev, property]);
    
    // Simulate blockchain confirmation
    setTimeout(() => {
      setProperties(prev => 
        prev.map(p => p.id === property.id ? { ...p, status: 'active' as const } : p)
      );
      toast({
        title: "Property Registered",
        description: `Property at ${property.address} has been successfully registered on the blockchain.`,
      });
    }, 3000);

    toast({
      title: "Registration Submitted",
      description: "Your property registration is being processed on the blockchain...",
    });
  };

  const handlePropertyTransfer = (propertyId: string, newOwner: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const transaction: Transaction = {
      id: `tx_${Math.random().toString(16).substr(2, 6)}`,
      propertyId,
      fromOwner: property.owner,
      toOwner: newOwner,
      timestamp: new Date().toISOString(),
      value: property.value,
      status: 'pending',
      blockHash: `0xblock${Math.random().toString(16).substr(2, 8)}...`
    };

    setTransactions(prev => [...prev, transaction]);
    
    // Simulate blockchain confirmation
    setTimeout(() => {
      setProperties(prev => 
        prev.map(p => p.id === propertyId ? { ...p, owner: newOwner } : p)
      );
      setTransactions(prev => 
        prev.map(t => t.id === transaction.id ? { ...t, status: 'completed' as const } : t)
      );
      toast({
        title: "Transfer Completed",
        description: `Property ownership has been successfully transferred to ${newOwner}.`,
      });
    }, 4000);

    toast({
      title: "Transfer Initiated",
      description: "Property transfer is being processed on the blockchain...",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary rounded-lg">
                <Home className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Land Registry</h1>
                <p className="text-sm text-muted-foreground">Blockchain-powered property management</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-success text-success-foreground">
                Network: Active
              </Badge>
              <Badge variant="outline" className="bg-registry-blue text-registry-blue-foreground">
                Block: #1,234,567
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search Properties</span>
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Register Property</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search">
            <PropertySearch 
              properties={properties} 
              onTransfer={handlePropertyTransfer}
            />
          </TabsContent>

          <TabsContent value="register">
            <PropertyRegistration onRegister={handlePropertyRegistration} />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionHistory transactions={transactions} />
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Registry Analytics</CardTitle>
                <CardDescription>Overview of blockchain activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                    <div className="text-3xl font-bold text-primary">{properties.length}</div>
                    <div className="text-sm text-muted-foreground">Total Properties</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-registry-blue/10 to-registry-blue/5 rounded-lg">
                    <div className="text-3xl font-bold text-registry-blue">{transactions.length}</div>
                    <div className="text-sm text-muted-foreground">Total Transactions</div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-success/10 to-success/5 rounded-lg">
                    <div className="text-3xl font-bold text-success">
                      ${properties.reduce((sum, p) => sum + p.value, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Value</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};