import React, { useState } from 'react';
import axios from 'axios';
import axiosClient from './api/axios';

const TestEmail = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

const testEmail = async () => {
    setLoading(true);
    try {
        const { data: me } = await axiosClient.get('/api/me');

        if (me.role !== 'barber') {
            alert('You are not a barber, email will not be sent.');
            setLoading(false);
            return;
        }

        const response = await axiosClient.post('/api/barber/emails/welcome');

        setMessage(response.data.message + ` to ${response.data.recipient_email}`);
    } catch (error) {
        console.error(error);
        setMessage(error.response?.data?.error || 'Error sending email');
    } finally {
        setLoading(false);
    }
};


  return (
    <div>
      <button 
        onClick={testEmail} 
        disabled={loading}
        style={{padding: '10px 20px', background: '#007bff', color: 'white', border: 'none'}}
      >
        {loading ? 'Sending...' : 'Test Email'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default TestEmail;