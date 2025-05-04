import React, { useEffect, useState, useContext } from 'react';
import './List.css';
import { url, currency } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../Context/StoreContext';

const List = () => {
  const { token, setFoodList, food_list } = useContext(StoreContext);
  const [list, setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`, { headers: { token } });
    if (response.data.success) {
      setList(response.data.data);
      setFoodList(response.data.data);
    } else {
      toast.error("Error fetching food list");
    }
  };

  const removeFood = async (foodId) => {
    const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
    if (response.data.success) {
      toast.success(response.data.message);
      fetchList();
    } else {
      toast.error("Error removing food item");
    }
  };

  const toggleDynamicPricing = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/toggle-dynamic-pricing`, { foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Toggle failed");
      }
    } catch (error) {
      toast.error("Error toggling dynamic pricing");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>All Foods List</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Dynamic Pricing</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className='list-table-format'>
            <img src={`${url}/images/${item.image}`} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={item.dynamicPricing || false}
                  onChange={() => toggleDynamicPricing(item._id)}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <p className='cursor' onClick={() => removeFood(item._id)}>x</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
