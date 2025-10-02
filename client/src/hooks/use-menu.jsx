import { useEffect, useState } from "react";
import api from "../lib/api";
import { useToast } from "./use-toast";

export function useMenu() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [itemsRes, catRes] = await Promise.all([
        api.get("/menu"),
        api.get("/menu/categories"),
      ]);
      setItems(itemsRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      toast({ title: "Failed to load menu", description: err.response?.data?.error || "Try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const createItem = async (payload) => {
    setSaving(true);
    try {
      const res = await api.post("/menu", payload);
      setItems(prev => [res.data, ...prev]);
      toast({ title: "Item created" });
    } catch (err) {
      toast({ title: "Create failed", description: err.response?.data?.error || "Try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updateItem = async (id, payload) => {
    setSaving(true);
    try {
      const res = await api.put(`/menu/${encodeURIComponent(id)}`, payload);
      setItems(prev => prev.map(i => (i.id === id ? res.data : i)));
      toast({ title: "Item updated" });
    } catch (err) {
      toast({ title: "Update failed", description: err.response?.data?.error || "Try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (id) => {
    setSaving(true);
    try {
      await api.delete(`/menu/${encodeURIComponent(id)}`);
      setItems(prev => prev.filter(i => i.id !== id));
      toast({ title: "Item deleted" });
    } catch (err) {
      toast({ title: "Delete failed", description: err.response?.data?.error || "Try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const createCategory = async (payload) => {
    setSaving(true);
    try {
      const res = await api.post("/menu/categories", payload);
      setCategories(prev => [res.data, ...prev]);
      toast({ title: "Category created" });
    } catch (err) {
      toast({ title: "Create failed", description: err.response?.data?.error || "Try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const updateCategory = async (id, payload) => {
    setSaving(true);
    try {
      const res = await api.put(`/menu/categories/${encodeURIComponent(id)}`, payload);
      setCategories(prev => prev.map(c => (c.id === id ? res.data : c)));
      toast({ title: "Category updated" });
    } catch (err) {
      toast({ title: "Update failed", description: err.response?.data?.error || "Try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    setSaving(true);
    try {
      await api.delete(`/menu/categories/${encodeURIComponent(id)}`);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast({ title: "Category deleted" });
    } catch (err) {
      toast({ title: "Delete failed", description: err.response?.data?.error || "Try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return {
    items,
    categories,
    isLoading,
    saving,
    reload: loadAll,
    createItem,
    updateItem,
    deleteItem,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}



