'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute, useAuth } from '@/contexts/AuthContext';
import * as accountsAPI from '@/lib/api/accounts';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import Header from '@/components/Site/Header';
import Footer from '@/components/Site/Footer';

interface OrderSummary {
  id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: string;
  total: string;
  created_at: string;
}

function OrdersListContent() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await accountsAPI.getOrders();
      setOrders(ordersData);
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Failed to Load Orders',
        description: error.message || 'Unable to load your orders. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="py-[50px]">
          <div className="wrapper 2xl:px-0 px-[15px]">
            <div className="text-center">Loading orders...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="sm:pt-[40px] pt-[20px]">
        <div className="wrapper 2xl:px-0 px-[15px]">
          <ul className="flex gap-[5px] items-center">
            <li className="flex items-center gap-1">
              <Link href="/" className="text-[16px] leading-[16px] font-semibold text-[#111111CC] hover:text-accent">Home</Link> <span>-</span>
            </li>
            <li className="flex items-center gap-1 text-[#111111] font-black">My Orders</li>
          </ul>
        </div>
      </div>
      <div className="sm:pt-[50px] pt-[30px] lg:pb-[80px] pb-[50px]">
        <div className="wrapper 2xl:px-0 px-[15px]">
          <h1 className="text-[32px] font-bold mb-6">My Orders</h1>

          {orders.length === 0 ? (
            <Card className="shadow-none border-[#25252526] rounded-[20px]">
              <CardContent className="p-8 text-center">
                <p className="text-[18px] text-[#666] mb-4">You haven't placed any orders yet.</p>
                <Link href="/products">
                  <Button variant="secondary">Browse Products</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="shadow-none border-[#25252526] rounded-[20px] hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-[20px] font-bold">Order #{order.order_number}</h3>
                          <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
                            Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                          </span>
                        </div>
                        <p className="text-[14px] text-[#666] mb-2">
                          Placed on {formatDate(order.created_at)}
                        </p>
                        <p className="text-[18px] font-bold text-accent">
                          Total: ${parseFloat(order.total).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <Link href={`/accounts/orders/${order.order_number}`}>
                          <Button variant="outline">View Details</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersListContent />
    </ProtectedRoute>
  );
}






















