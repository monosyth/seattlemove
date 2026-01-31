import { useState } from 'react';

/**
 * Custom hook for managing entity CRUD state
 * Replaces 5 state variables per entity type with a single hook
 *
 * @param {Object} initialNewData - Initial state for new entity form
 * @returns {Object} Entity management state and setters
 */
export const useEntityManager = (initialNewData = {}) => {
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [adding, setAdding] = useState(false);
  const [newData, setNewData] = useState(initialNewData);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const resetAll = () => {
    setEditingId(null);
    setEditingData({});
    setAdding(false);
    setNewData(initialNewData);
    setConfirmDeleteId(null);
  };

  const startAdding = () => {
    setAdding(true);
    setNewData(initialNewData);
  };

  const cancelAdding = () => {
    setAdding(false);
    setNewData(initialNewData);
  };

  const startEditing = (id, data) => {
    setEditingId(id);
    setEditingData(data);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({});
  };

  const startDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
  };

  return {
    // State
    editingId,
    editingData,
    adding,
    newData,
    confirmDeleteId,

    // Setters (for direct state updates)
    setEditingId,
    setEditingData,
    setAdding,
    setNewData,
    setConfirmDeleteId,

    // Helper methods
    resetAll,
    startAdding,
    cancelAdding,
    startEditing,
    cancelEditing,
    startDelete,
    cancelDelete
  };
};

/**
 * Custom hook for managing list item state (checklist, budget items)
 * @param {Object} initialNewData - Initial state for new item form
 * @returns {Object} List item management state and setters
 */
export const useListItemManager = (initialNewData = {}) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [newItemParent, setNewItemParent] = useState(null); // stepId or category
  const [newItemText, setNewItemText] = useState('');

  const resetAll = () => {
    setEditingId(null);
    setEditText('');
    setConfirmDeleteId(null);
    setDraggedId(null);
    setDragOverId(null);
    setNewItemParent(null);
    setNewItemText('');
  };

  return {
    // State
    editingId,
    editText,
    confirmDeleteId,
    draggedId,
    dragOverId,
    newItemParent,
    newItemText,

    // Setters
    setEditingId,
    setEditText,
    setConfirmDeleteId,
    setDraggedId,
    setDragOverId,
    setNewItemParent,
    setNewItemText,

    // Helper
    resetAll
  };
};
