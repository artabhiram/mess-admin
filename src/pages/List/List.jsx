import React, { useEffect, useState, useContext } from 'react';
import './List.css';
import { url, currency } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../Context/StoreContext';

const List = () => {
  const { token, setFoodList } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const [editMode, setEditMode] = useState({}); // Track edit mode for each food item

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

  const updateFood = async (id, field, value) => {
    try {
      const response = await axios.post(`${url}/api/food/update`, { id, field, value });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Error updating food item");
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedList = [...list];
    updatedList[index][field] = value;
    setList(updatedList);
  };

  const toggleEdit = (id) => {
    setEditMode((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const saveChanges = (item) => {
    updateFood(item._id, "name", item.name);
    updateFood(item._id, "price", item.price);
    toggleEdit(item._id);
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
          <div key={item._id} className='list-table-format'>
            <img src={`${url}/images/${item.image}`} alt={item.name} />

            {editMode[item._id] ? (
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleInputChange(index, "name", e.target.value)}
              />
            ) : (
              <p>{item.name}</p>
            )}

            <p>{item.category}</p>

            {editMode[item._id] ? (
              <input
                type="number"
                min="0"
                value={item.price}
                onChange={(e) => handleInputChange(index, "price", e.target.value)}
              />
            ) : (
              <p>{currency}{item.price}</p>
            )}

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

            <div className='action-buttons'>
              {editMode[item._id] ? (
                <button onClick={() => saveChanges(item)}>Save</button>
              ) : (
                <button onClick={() => toggleEdit(item._id)}>Edit</button>
              )}
              <p className='cursor' onClick={() => removeFood(item._id)}>x</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
