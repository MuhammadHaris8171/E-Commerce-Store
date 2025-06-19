import React, { useEffect, useState } from 'react';
import HeaderSection from '../components/EditItemPage/HeaderSection';
import TabNavigation from '../components/EditItemPage/TabNavigation';
// import ItemDetailsForm from '../components/EditItemPage/MainContent/ItemDetailForm';
// import LocationTogglePanel from '../components/EditItemPage/MainContent/LocationTogglePanel';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import backend_url from '../config/config';

export default function EditItem() {
    const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`${backend_url}/items/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error('Error fetching item:', err);
      }
    };
    fetchItem();
  }, [id]);

  if (!item) return <div className="p-4">Loading item...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <HeaderSection />
      <TabNavigation />
      <div className="flex gap-6 mt-6">
        {/* <ItemDetailsForm  item={item}/> */}
        {/* <LocationTogglePanel /> */}
      </div>
    </div>
  );
}
