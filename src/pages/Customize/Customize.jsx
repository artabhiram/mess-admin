import React, { useEffect, useState, useContext } from 'react';
import './Customize.css';
import { assets, url } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../Context/StoreContext';

const Customize = () => {
  const { token, mess, setMess } = useContext(StoreContext);

  const [logo, setLogo] = useState(null);
  const [primaryColor, setPrimaryColor] = useState('#ffffff');
  const [secondaryColor, setSecondaryColor] = useState('#000000');
  const [cardColor, setCardColor] = useState('#f5f5f5');
  const [textColor, setTextColor] = useState('#333333');

  useEffect(() => {
    if (!mess) {
      setMess(JSON.parse(localStorage.getItem("mess")));
    }
    if (mess) {
      if (mess.primaryColor) setPrimaryColor(mess.primaryColor);
      if (mess.secondaryColor) setSecondaryColor(mess.secondaryColor);
      if (mess.cardColor) setCardColor(mess.cardColor);
      if (mess.textColor) setTextColor(mess.textColor);
    }
  }, [mess]);

  const handleSave = async () => {
    const formData = new FormData();
    if (logo) formData.append('image', logo);
    formData.append('primaryColor', primaryColor);
    formData.append('secondaryColor', secondaryColor);
    formData.append('cardColor', cardColor);
    formData.append('textColor', textColor);

    try {
      const response = await axios.post(`${url}/api/mess/theme`, formData, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success('Customization saved');
        // Optionally update store context or re-fetch the mess data
      } else {
        toast.error('Failed to save customization');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const previewImage = () => {
    if (logo) return URL.createObjectURL(logo);
    if (mess?.image) return `${url}/images/${mess.image}`;
    return assets.upload_area;
  };

  return (
    <div className='customize'>
      <h2>Admin Theme Customization</h2>

      <div className='customize-section'>
        <p>Upload Logo</p>
        <input
          onChange={(e) => {
            setLogo(e.target.files[0]);
            e.target.value = '';
          }}
          type="file"
          accept="image/*"
          id="logo"
          hidden
        />
        <label htmlFor="logo">
          <img
            src={previewImage()}
            alt="logo-preview"
            className="logo-preview"
          />
        </label>
      </div>

      <div className='customize-section'>
        <label>Primary Color</label>
        <input
          type="color"
          value={primaryColor}
          onChange={(e) => setPrimaryColor(e.target.value)}
        />
      </div>

      <div className='customize-section'>
        <label>Secondary Color</label>
        <input
          type="color"
          value={secondaryColor}
          onChange={(e) => setSecondaryColor(e.target.value)}
        />
      </div>

      <div className='customize-section'>
        <label>Card Background Color</label>
        <input
          type="color"
          value={cardColor}
          onChange={(e) => setCardColor(e.target.value)}
        />
      </div>

      <div className='customize-section'>
        <label>Text Color</label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
        />
      </div>

      <button className='customize-btn' onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
};

export default Customize;
