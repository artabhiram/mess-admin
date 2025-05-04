import React, { useContext, useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url, currency } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [foodStats, setFoodStats] = useState({
    "Food Processing": [],
    "Out for delivery": [],
    "Delivered": []
  });
  const [view, setView] = useState('summary'); // Toggle between 'summary' and 'orders'
  const [dailySales, setDailySales] = useState(0);

  const { token, food_list } = useContext(StoreContext);

  const fetchAllOrders = async () => {
    const response = await axios.get(`${url}/api/order/list`, { headers: { token } });
    if (response.data.success) {
      const reversedOrders = response.data.data.reverse();
      setOrders(reversedOrders);
      computeFoodStats(reversedOrders);
      computeDailySales(reversedOrders);
    } else {
      toast.error("Error fetching orders");
    }
  };

  const computeDailySales = (orders) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const total = orders.reduce((sum, order) => {
      const orderDate = new Date(order.date).toISOString().split('T')[0];
      return orderDate === today ? sum + order.amount : sum;
    }, 0);
    setDailySales(total);
  };

  const computeFoodStats = (orders) => {
    const statusGroups = {
      "Food Processing": {},
      "Out for delivery": {},
      "Delivered": {}
    };

    orders.forEach(order => {
      const group = statusGroups[order.status];
      if (!group) return;

      order.items.forEach(item => {
        const foodData = food_list.find(food => food._id === item._id);
        if (!foodData) return;

        if (!group[item._id]) {
          group[item._id] = { ...foodData, count: item.quantity };
        } else {
          group[item._id].count += item.quantity;
        }
      });
    });

    setFoodStats({
      "Food Processing": Object.values(statusGroups["Food Processing"]),
      "Out for delivery": Object.values(statusGroups["Out for delivery"]),
      "Delivered": Object.values(statusGroups["Delivered"]),
    });
  };

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(`${url}/api/order/status`, {
      orderId,
      status: event.target.value
    });
    if (response.data.success) {
      await fetchAllOrders();
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className='order add'>
      <div className="toggle-buttons">
        <button
          className={view === 'summary' ? 'active' : ''}
          onClick={() => setView('summary')}
        >
          Food Summary
        </button>
        <button
          className={view === 'orders' ? 'active' : ''}
          onClick={() => setView('orders')}
        >
          Orders
        </button>
      </div>

      {view === 'summary' && (
        <>
          <h3 style={{ marginTop: "10px" }}>Total Sales Today: {currency}{dailySales.toFixed(2)}</h3>
          {["Food Processing", "Out for delivery", "Delivered"].map(status => (
            <div key={status}>
              <h3>{status}</h3>
              <div className='food-stats-grid'>
                {foodStats[status].map((item, idx) => (
                  <div className='food-stat-card' key={idx}>
                    <img src={`${url}/images/${item.image}`} alt={item.name} />
                    <p><strong>{item.name}</strong></p>
                    <p>Ordered: {item.count} times</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {view === 'orders' && (
        <>
          <h3>Orders</h3>
          <div className="order-list">
            {orders.map((order, index) => (
              <div key={index} className='order-item'>
                <img src={assets.parcel_icon} alt="" />
                <div>
                  <p className='order-item-food'>
                    {order.items.map((item, index) => (
                      index === order.items.length - 1
                        ? `${item.name} x ${item.quantity}`
                        : `${item.name} x ${item.quantity}, `
                    ))}
                  </p>
                  <p className='order-item-name'>{order.address.firstName + " " + order.address.lastName}</p>
                  <div className='order-item-address'>
                    <p>{order.address.street + ","}</p>
                    <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                  </div>
                  <p className='order-item-phone'>{order.address.phone}</p>
                </div>
                <p>Items: {order.items.length}</p>
                <p>{currency}{order.amount}</p>
                <select onChange={(e) => statusHandler(e, order._id)} value={order.status}>
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Order;
