import React, { useState } from 'react';

const NodePopup = ({ onSave, onClose }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('title before saving:', title);
    onSave(title);
    console.log('title after saving:', title);
    onClose();
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter node title"
        />
        <button type="submit">Save</button>
      </form>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default NodePopup;
