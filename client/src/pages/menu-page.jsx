import { useMenu } from "../hooks/use-menu";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";
import { uploadToSupabase } from "../lib/storage";

export default function MenuPage() {
  const {
    items,
    categories,
    isLoading,
    saving,
    createItem,
    updateItem,
    deleteItem,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useMenu();

  const [itemForm, setItemForm] = useState({ name: "", price: "", categoryId: "", availability: true, stockLimit: "", description: "", photoUrl: "" });
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "" });

  const onCreateItem = async (e) => {
    e.preventDefault();
    let photoUrl = itemForm.photoUrl;
    if (itemForm.file instanceof File) {
      const uploaded = await uploadToSupabase(itemForm.file, "menu");
      photoUrl = uploaded.url;
    }
    const payload = {
      ...itemForm,
      photoUrl,
      price: Number(itemForm.price || 0),
      stockLimit: itemForm.stockLimit === "" ? null : Number(itemForm.stockLimit),
    };
    delete payload.file;
    createItem(payload);
  };

  const onCreateCategory = (e) => {
    e.preventDefault();
    createCategory(categoryForm);
  };

  return (
    <div className="p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={onCreateCategory} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label>Name</Label>
              <Input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
            </div>
            <Button type="submit" disabled={saving}>Add Category</Button>
          </form>

          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between border rounded p-3">
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-sm text-gray-500">{c.description || ""}</div>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => updateCategory(c.id, { name: c.name, description: c.description })}>Edit</Button>
                  <Button variant="destructive" onClick={() => deleteCategory(c.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={onCreateItem} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div className="md:col-span-2">
              <Label>Name</Label>
              <Input value={itemForm.name} onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })} required />
            </div>
            <div>
              <Label>Price</Label>
              <Input type="number" step="0.01" value={itemForm.price} onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })} required />
            </div>
            <div>
              <Label>Category</Label>
              <select className="border rounded h-10 px-3 w-full" value={itemForm.categoryId} onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })}>
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Stock Limit</Label>
              <Input type="number" value={itemForm.stockLimit} onChange={(e) => setItemForm({ ...itemForm, stockLimit: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Photo URL</Label>
              <Input value={itemForm.photoUrl} onChange={(e) => setItemForm({ ...itemForm, photoUrl: e.target.value })} />
            </div>
            <div>
              <Label>Upload Image</Label>
              <input type="file" accept="image/*" onChange={(e) => setItemForm({ ...itemForm, file: e.target.files?.[0] })} />
            </div>
            <div className="md:col-span-6">
              <Label>Description</Label>
              <Input value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} />
            </div>
            <Button type="submit" disabled={saving}>Add Item</Button>
          </form>

          <div className="space-y-2">
            {items.map((i) => (
              <div key={i.id} className="flex items-center justify-between border rounded p-3">
                <div className="flex items-center gap-3">
                  {i.photoUrl ? (
                    <img src={i.photoUrl} alt={i.name} className="w-16 h-16 object-cover rounded" />
                  ) : null}
                  <div>
                    <div className="font-medium">{i.name}</div>
                    <div className="text-sm text-gray-500">{i.category?.name || "Uncategorized"} • ₱{Number(i.price).toFixed(2)}</div>
                    {i.stockLimit !== null && (
                      <div className="text-xs text-gray-400">Stock: {i.stockLimit}</div>
                    )}
                  </div>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => updateItem(i.id, { availability: !i.availability })}>
                    {i.availability ? "Disable" : "Enable"}
                  </Button>
                  <Button variant="destructive" onClick={() => deleteItem(i.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


