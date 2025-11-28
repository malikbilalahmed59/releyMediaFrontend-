'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute, useAuth } from '@/contexts/AuthContext';
import * as accountsAPI from '@/lib/api/accounts';
import type { Order } from '@/lib/api/accounts';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast';
import Header from '@/components/Site/Header';
import Footer from '@/components/Site/Footer';

function OrderDetailContent() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    if (orderNumber) {
      loadOrder();
    }
  }, [orderNumber]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const orderData = await accountsAPI.getOrder(orderNumber);
      setOrder(orderData);
    } catch (error: any) {
      addToast({
        type: 'error',
        title: 'Failed to Load Order',
        description: error.message || 'Unable to load order details. Please try again.',
      });
      router.push('/accounts/orders');
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="py-[50px]">
          <div className="wrapper 2xl:px-0 px-[15px]">
            <div className="text-center">Loading order details...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <div className="py-[50px]">
          <div className="wrapper 2xl:px-0 px-[15px]">
            <div className="text-center">
              <p className="text-[18px] text-[#666] mb-4">Order not found.</p>
              <Link href="/accounts/orders">
                <Button variant="secondary">Back to Orders</Button>
              </Link>
            </div>
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
            <li className="flex items-center gap-1">
              <Link href="/accounts/orders" className="text-[16px] leading-[16px] font-semibold text-[#111111CC] hover:text-accent">My Orders</Link> <span>-</span>
            </li>
            <li className="flex items-center gap-1 text-[#111111] font-black">Order #{order.order_number}</li>
          </ul>
        </div>
      </div>
      <div className="sm:pt-[50px] pt-[30px] lg:pb-[80px] pb-[50px]">
        <div className="wrapper 2xl:px-0 px-[15px]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[32px] font-bold">Order #{order.order_number}</h1>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-[14px] font-semibold ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span className={`px-4 py-2 rounded-full text-[14px] font-semibold ${getPaymentStatusColor(order.payment_status)}`}>
                Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-none border-[#25252526] rounded-[20px]">
                <CardHeader className="bg-accent rounded-t-[20px] py-4 px-6">
                  <CardTitle className="text-white font-bold text-[18px]">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[16px] mb-1">{item.product_name}</h4>
                          {item.part_name && (
                            <p className="text-[14px] text-[#666] mb-1">Part: {item.part_name}</p>
                          )}
                          <p className="text-[14px] text-[#666]">Quantity: {item.quantity}</p>
                          <p className="text-[14px] text-[#666]">Price per unit: ${parseFloat(item.price_per_unit).toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[18px]">${parseFloat(item.total_price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="shadow-none border-[#25252526] rounded-[20px]">
                <CardHeader className="bg-accent rounded-t-[20px] py-4 px-6">
                  <CardTitle className="text-white font-bold text-[18px]">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[14px] text-[#666]">Subtotal:</span>
                    <span className="font-semibold">${parseFloat(order.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[14px] text-[#666]">Shipping:</span>
                    <span className="font-semibold">${parseFloat(order.shipping).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[14px] text-[#666]">Tax:</span>
                    <span className="font-semibold">${parseFloat(order.tax).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t-2 border-accent">
                    <span className="font-bold text-[18px]">Total:</span>
                    <span className="font-bold text-[20px] text-accent">${parseFloat(order.total).toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none border-[#25252526] rounded-[20px]">
                <CardHeader className="bg-accent rounded-t-[20px] py-4 px-6">
                  <CardTitle className="text-white font-bold text-[18px]">Order Information</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div>
                    <p className="text-[12px] text-[#666] mb-1">Order Date</p>
                    <p className="font-semibold">{formatDate(order.created_at)}</p>
                  </div>
                  {order.notes && (
                    <div>
                      <p className="text-[12px] text-[#666] mb-1">Notes</p>
                      <p className="text-[14px]">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Link href="/accounts/orders">
                <Button variant="secondary" className="w-full">Back to Orders</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function OrderDetailPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <>
          <Header />
          <div className="py-[50px]">
            <div className="wrapper 2xl:px-0 px-[15px]">
              <div className="text-center">Loading...</div>
            </div>
          </div>
          <Footer />
        </>
      }>
        <OrderDetailContent />
      </Suspense>
    </ProtectedRoute>
  );
}

