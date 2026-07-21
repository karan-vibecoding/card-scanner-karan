import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useForm, Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { Upload, Camera, Save, Loader2, X, Plus, ScanLine } from 'lucide-react';
import { BusinessCard, Category } from '../types';

const compressImage = (fileOrVideo: File | HTMLVideoElement, maxWidth = 1024): Promise<string> => {
  return new Promise((resolve, reject) => {
    let img: HTMLImageElement | HTMLVideoElement;
    
    const process = () => {
      const canvas = document.createElement('canvas');
      let width = img instanceof HTMLVideoElement ? img.videoWidth : img.width;
      let height = img instanceof HTMLVideoElement ? img.videoHeight : img.height;
      
      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      } else {
        reject(new Error("No canvas context"));
      }
    };

    if (fileOrVideo instanceof File) {
      img = new Image();
      img.onload = process;
      img.onerror = reject;
      img.src = URL.createObjectURL(fileOrVideo);
    } else {
      img = fileOrVideo;
      process();
    }
  });
};

export default function ScanCard() {
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const { register, handleSubmit, reset, control, setValue, watch, formState: { errors } } = useForm<BusinessCard>({
    defaultValues: {
      fullName: '',
      firstName: '',
      lastName: '',
      company: '',
      designation: '',
      phoneNumbers: [],
      emails: [],
      website: '',
      address: '',
      linkedIn: '',
      socialLinks: [],
      category: '',
      notes: '',
      tags: [],
    }
  });

  useEffect(() => {
    async function loadCategories() {
      if (!user) return;
      const q = query(collection(db, 'categories'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const cats: Category[] = [];
      snap.forEach(doc => cats.push({ id: doc.id, ...doc.data() } as Category));
      setCategories(cats);
    }
    loadCategories();
  }, [user]);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  } as any);

  const processFile = async (file: File) => {
    try {
      const dataUrl = await compressImage(file);
      setImagePreview(dataUrl);
      const [meta, base64] = dataUrl.split(',');
      setBase64Image(base64);
      setMimeType('image/jpeg');
    } catch (error) {
      console.error("Image processing error", error);
      toast.error("Failed to process image");
    }
  };

  const scanImage = async (b64?: string, mime?: string) => {
    const finalBase64 = b64 || base64Image;
    const finalMime = mime || mimeType;
    if (!finalBase64) return;
    
    setIsScanning(true);
    const toastId = toast.loading('Extracting data with AI...');
    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: finalBase64, mimeType: finalMime })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'OCR failed');
      }
      const data = await response.json();
      
      const safeString = (val: any) => {
        if (typeof val === 'string') return val;
        if (typeof val === 'number' || typeof val === 'boolean') return String(val);
        if (val) return JSON.stringify(val);
        return '';
      };
      
      const safeArray = (val: any) => {
        if (Array.isArray(val)) return val.map(safeString);
        if (val) return [safeString(val)];
        return [];
      };

      const extractedFullName = safeString(data.fullName);
      let extractedFirstName = safeString(data.firstName);
      let extractedLastName = safeString(data.lastName);

      if (extractedFullName && (!extractedFirstName && !extractedLastName)) {
        const parts = extractedFullName.trim().split(/\s+/);
        if (parts.length > 0) {
          extractedFirstName = parts[0];
          extractedLastName = parts.slice(1).join(' ');
        }
      }

      setValue('fullName', extractedFullName);
      setValue('firstName', extractedFirstName);
      setValue('lastName', extractedLastName);
      setValue('company', safeString(data.company));
      setValue('designation', safeString(data.designation));
      setValue('website', safeString(data.website));
      setValue('address', safeString(data.address));
      setValue('linkedIn', safeString(data.linkedIn));
      setValue('notes', safeString(data.notes));
      setValue('phoneNumbers', safeArray(data.phoneNumbers));
      setValue('emails', safeArray(data.emails));
      setValue('socialLinks', safeArray(data.socialLinks));
      
      toast.success('Extraction complete!', { id: toastId });
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(200);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(`Failed to extract data: ${error.message || 'Please try again.'}`, { id: toastId });
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim() || !user) return;
    try {
      const docRef = await addDoc(collection(db, 'categories'), {
        userId: user.uid,
        name: newCategory.trim(),
        createdAt: Date.now()
      });
      setCategories([...categories, { id: docRef.id, userId: user.uid, name: newCategory.trim(), createdAt: Date.now() }]);
      setValue('category', newCategory.trim());
      setNewCategory('');
      setShowNewCat(false);
      toast.success('Category added');
    } catch (e) {
      toast.error('Failed to add category');
    }
  };

  const onSubmit = async (data: BusinessCard) => {
    if (!user) return;
    setIsSaving(true);
    const toastId = toast.loading('Saving business card...');
    try {
      // Optional: process image to smaller thumbnail to avoid 1MB limit.
      // Here we just save the base64, usually phone cameras make big files, we should probably resize.
      // For simplicity in this demo we'll save the raw base64.
      
      const cleanArray = (val: any) => {
        if (Array.isArray(val)) return val.map(s => s.trim()).filter(Boolean);
        if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
        return [];
      };

      await addDoc(collection(db, 'cards'), {
        ...data,
        phoneNumbers: cleanArray(data.phoneNumbers),
        emails: cleanArray(data.emails),
        tags: cleanArray(data.tags),
        socialLinks: cleanArray(data.socialLinks),
        userId: user.uid,
        imageUrl: imagePreview, // Could be large
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      toast.success('Card saved successfully!', { id: toastId });
      reset();
      setImagePreview(null);
      setBase64Image(null);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save card.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Play the video explicitly to ensure it loads
          videoRef.current.play().catch(console.error);
        }
      }, 50);
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Could not access camera. Please check permissions or use file upload.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = useCallback(async () => {
    try {
      if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
        const dataUrl = await compressImage(videoRef.current);
        setImagePreview(dataUrl);
        
        const [meta, base64] = dataUrl.split(',');
        setBase64Image(base64);
        setMimeType('image/jpeg');
        
        stopCamera();
        
        // Auto-trigger OCR extraction
        await scanImage(base64, 'image/jpeg');
      }
    } catch (e) {
      console.error('Failed to capture photo:', e);
      toast.error('Failed to capture photo');
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let timeoutId: NodeJS.Timeout;
    let lastFrameData: ImageData | null = null;
    let stableFrames = 0;
    const stableThreshold = 15; // Roughly 1-2 seconds depending on frame rate
    let isCapturing = false;
    let isActive = true;

    const checkStability = () => {
      if (!isActive) return;
      
      if (!videoRef.current || videoRef.current.readyState < 2 || videoRef.current.videoWidth === 0 || isCapturing) {
        timeoutId = setTimeout(() => {
          if (isActive) animationFrameId = requestAnimationFrame(checkStability);
        }, 100);
        return;
      }

      try {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          if (lastFrameData) {
            let diff = 0;
            const length = currentData.data.length;
            for (let i = 0; i < length; i += 16) {
              diff += Math.abs(currentData.data[i] - lastFrameData.data[i]);
              diff += Math.abs(currentData.data[i+1] - lastFrameData.data[i+1]);
              diff += Math.abs(currentData.data[i+2] - lastFrameData.data[i+2]);
            }
            
            const avgDiff = diff / (length / 16 * 3);
            
            if (avgDiff < 8) {
              stableFrames++;
            } else {
              stableFrames = 0;
            }
            
            if (stableFrames > stableThreshold) {
              isCapturing = true;
              capturePhoto();
              return;
            }
          }
          lastFrameData = currentData;
        }
      } catch (err) {
        console.error("Error in motion detection:", err);
      }
      
      timeoutId = setTimeout(() => {
        if (isActive && !isCapturing) {
          animationFrameId = requestAnimationFrame(checkStability);
        }
      }, 100);
    };

    if (showCamera) {
      checkStability();
    }

    return () => {
      isActive = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showCamera, capturePhoto]);

  const handleCamera = () => {
    startCamera();
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Scan Card</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Image Upload & Preview */}
        <div className="space-y-6">
          {!imagePreview && !showCamera ? (
            <div className="space-y-4">
              <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-white'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-1">Drag & drop image here</p>
                <p className="text-sm text-gray-500">or click to browse from your computer</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="h-px bg-gray-200 flex-1"></div>
                <span className="text-sm text-gray-500 font-medium">OR</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </div>

              <button
                onClick={handleCamera}
                className="w-full bg-white border border-gray-300 text-gray-700 py-4 rounded-2xl flex items-center justify-center font-medium hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Camera className="w-5 h-5 mr-2" />
                Scan a card
              </button>
            </div>
          ) : showCamera ? (
            <div className="bg-black rounded-2xl overflow-hidden relative h-96 flex flex-col items-center justify-center">
              <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
              
              <div className="absolute inset-6 border-2 border-dashed border-white/50 rounded-xl pointer-events-none"></div>
              <div className="absolute top-6 bg-black/60 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm z-10 shadow-sm font-medium">
                Hold card still to auto-capture...
              </div>

              <button 
                onClick={stopCamera}
                className="absolute top-6 right-6 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 z-10 transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm relative">
              <button 
                onClick={() => { setImagePreview(null); setBase64Image(null); reset(); }}
                className="absolute top-6 right-6 p-1.5 bg-white rounded-full shadow-md text-gray-500 hover:text-gray-900 z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="rounded-xl overflow-hidden bg-gray-100 flex justify-center items-center h-64 mb-4 relative">
                <img src={imagePreview} alt="Business Card" className={`max-h-full object-contain ${isScanning ? 'opacity-50' : ''}`} />
                {isScanning && (
                  <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                    <div className="absolute left-0 w-full h-1 bg-blue-500 shadow-[0_0_15px_3px_rgba(59,130,246,0.8)] animate-scan"></div>
                  </div>
                )}
              </div>
              <button
                onClick={() => scanImage()}
                disabled={isScanning}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium flex items-center justify-center hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isScanning ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Scanning with AI...</>
                ) : (
                  <><ScanLine className="w-5 h-5 mr-2" /> Extract Data</>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Edit Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input {...register('firstName')} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500" placeholder="First Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input {...register('lastName')} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500" placeholder="Last Name" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input {...register('fullName')} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500" placeholder="Full Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input {...register('designation')} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500" placeholder="Job Title" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input {...register('company')} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Controller
                  name="phoneNumbers"
                  control={control}
                  render={({ field }) => (
                    <input 
                      value={Array.isArray(field.value) ? field.value.join(', ') : (typeof field.value === 'string' ? field.value : '')} 
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Comma separated"
                      className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500" 
                    />
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Controller
                  name="emails"
                  control={control}
                  render={({ field }) => (
                    <input 
                      value={Array.isArray(field.value) ? field.value.join(', ') : (typeof field.value === 'string' ? field.value : '')} 
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="Comma separated"
                      className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500" 
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input {...register('website')} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input {...register('address')} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Info</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                {!showNewCat ? (
                  <div className="flex space-x-2">
                    <select {...register('category', { required: "Category is required" })} required className="flex-1 border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Select Category...</option>
                      <option value="BMS">BMS</option>
                      <option value="XB-5K">XB-5K</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <button type="button" onClick={() => setShowNewCat(true)} className="p-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input 
                      value={newCategory} 
                      onChange={e => setNewCategory(e.target.value)} 
                      placeholder="New category name"
                      className="flex-1 border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button type="button" onClick={handleAddCategory} className="px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm">Add</button>
                    <button type="button" onClick={() => setShowNewCat(false)} className="px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 font-medium text-sm">Cancel</button>
                  </div>
                )}
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.category.message}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <input 
                      value={Array.isArray(field.value) ? field.value.join(', ') : (typeof field.value === 'string' ? field.value : '')} 
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="e.g. Hot Lead, Investor"
                      className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500" 
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea {...register('notes')} rows={3} className="w-full border-gray-300 rounded-lg shadow-sm p-2.5 border focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving || !imagePreview}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium flex items-center justify-center hover:bg-gray-800 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
              Save Contact
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
