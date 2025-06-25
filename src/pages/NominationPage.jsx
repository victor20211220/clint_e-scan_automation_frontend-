import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NominationForm from '../components/NominationForm';
import axios from '../services/axios';

export default function NominationPage({ isEdit = false }) {
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (isEdit && id) {
      axios.get(`/nominations/${id}`)
        .then(res => setInitialValues(res.data))
        .catch(() => setInitialValues({})); // fallback to empty
    }
  }, [id]);

  if (isEdit && !initialValues) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h4>{isEdit ? 'Edit' : 'New'} Nomination</h4>
      <NominationForm isEdit={isEdit} initialValues={initialValues || {}} />
    </div>
  );
}
