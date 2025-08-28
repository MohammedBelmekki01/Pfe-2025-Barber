import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, DollarSign, Clock, FileText, Type, X, Image } from "lucide-react";

export default function ServiceForm({ onSubmit, initialData = null, isEditing = false, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        duration: initialData.duration,
        image: null,
      });
      if (initialData.image) {
        setImagePreview(`${import.meta.env.VITE_BACKEND_URL}/storage/${initialData.image}`);
      }
    }
  }, [initialData]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image is too large (max 2MB)");
        return;
      }
      setForm(prev => ({ ...prev, [name]: file }));
      setImagePreview(URL.createObjectURL(file));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const removeImage = () => {
    setForm(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.price || !form.duration) {
      toast.error("Please fill in all required fields!");
      return;
    }
    await onSubmit(form);
    if (!isEditing) {
      setForm({
        name: '',
        description: '',
        price: '',
        duration: '',
        image: null,
      });
      setImagePreview(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Type className="w-4 h-4 text-emerald-500" />
            Service Name *
          </Label>
          <div className="relative">
            <Input
              id="name"
              name="name"
              required
              placeholder="e.g., Classic Haircut"
              value={form.name}
              onChange={handleChange}
              className="h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <Label htmlFor="price" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-500" />
            Price (MAD) *
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="price"
              name="price"
              required
              type="number"
              placeholder="150"
              value={form.price}
              onChange={handleChange}
              className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-500" />
            Duration (minutes) *
          </Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="duration"
              name="duration"
              required
              type="number"
              placeholder="30"
              value={form.duration}
              onChange={handleChange}
              className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Image className="w-4 h-4 text-emerald-500" />
            Service Image
          </Label>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                id="image-upload"
              />
              <Label
                htmlFor="image-upload"
                className="flex items-center justify-center h-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-emerald-500 transition-colors duration-300 bg-gray-50 dark:bg-gray-700"
              >
                <Upload className="w-5 h-5 mr-2 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-400">Choose Image</span>
              </Label>
            </div>
            {imagePreview && (
              <Card className="relative overflow-hidden rounded-xl">
                <CardContent className="p-0">
                  <img
                    src={imagePreview}
                    alt="Service preview"
                    className="w-full h-32 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={removeImage}
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-base font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-500" />
          Description
        </Label>
        <div className="relative">
          <FileText className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your service in detail..."
            value={form.description}
            onChange={handleChange}
            className="pl-10 min-h-[100px] border-0 bg-gray-50 dark:bg-gray-700 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isEditing ? 'Update Service' : 'Add Service'}
        </Button>
      </div>
    </form>
  );
}