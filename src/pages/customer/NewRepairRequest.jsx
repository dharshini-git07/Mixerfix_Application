import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Wrench, 
  FileText,
  Image as ImageIcon,
  Video
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepairs } from '../../context/RepairContext';
import { APPLIANCE_CATEGORIES } from '../../data/mockData';
import Modal from '../../components/common/Modal';

const NewRepairRequest = () => {
  const { currentUser } = useAuth();
  const { addRepair } = useRepairs();
  const navigate = useNavigate();

  // Form states
  const [formData, setFormData] = useState({
    customerName: currentUser?.name || '',
    customerEmail: currentUser?.email || '',
    customerPhone: currentUser?.phone || '',
    appliance: APPLIANCE_CATEGORIES[0].name,
    brand: '',
    model: '',
    issue: '',
    address: currentUser?.address || '',
    city: 'Bangalore',
    pincode: '560001',
    pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [createdRepairId, setCreatedRepairId] = useState('');

  // Handle inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Image upload simulation with FileReader
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          {
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            dataUrl: reader.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Video upload simulation
  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideos((prev) => [
          ...prev,
          {
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            dataUrl: reader.result,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeVideo = (index) => {
    setVideos((prev) => prev.filter((_, i) => i !== index));
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) newErrors.customerName = 'Full Name is required';
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,12}$/.test(formData.customerPhone.replace(/[\s-]/g, ''))) {
      newErrors.customerPhone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.brand.trim()) newErrors.brand = 'Appliance brand is required';
    if (!formData.issue.trim() || formData.issue.length < 10) {
      newErrors.issue = 'Please describe the problem in at least 10 characters';
    }
    if (!formData.address.trim()) newErrors.address = 'Pickup address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Valid 6-digit pincode is required';
    }
    if (!formData.pickupDate) newErrors.pickupDate = 'Preferred pickup date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newRepair = addRepair({
        ...formData,
        customerId: currentUser?.id || 'cust-1',
        images: images.map(img => img.dataUrl || img.name),
        videos: videos.map(v => v.dataUrl || v.name),
      });

      setCreatedRepairId(newRepair.id);
      setIsSubmitting(false);
      setSuccessModalOpen(true);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 font-heading">
          Book Appliance Repair
        </h1>
        <p className="text-slate-600 text-base font-medium mt-1">
          Enter appliance details & schedule doorstep pickup.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Customer Contact Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-[#087F75] font-bold text-sm flex items-center justify-center">
              1
            </span>
            <h2 className="font-bold text-base text-slate-900">Customer Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#087F75]/20 ${
                  errors.customerName ? 'border-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.customerName && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#087F75]/20 ${
                  errors.customerPhone ? 'border-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.customerPhone && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.customerPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="rahul@example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#087F75]/20 ${
                  errors.customerEmail ? 'border-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.customerEmail && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.customerEmail}</p>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Appliance Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-[#087F75] font-bold text-sm flex items-center justify-center">
              2
            </span>
            <h2 className="font-bold text-base text-slate-900">Appliance Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Appliance Category *
              </label>
              <select
                name="appliance"
                value={formData.appliance}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#087F75]/20 bg-white"
              >
                {APPLIANCE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Brand *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Philips, Samsung"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#087F75]/20 ${
                  errors.brand ? 'border-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.brand && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.brand}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Model Number (optional)
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. HL7756"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#087F75]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Problem Description *
            </label>
            <textarea
              name="issue"
              rows={4}
              value={formData.issue}
              onChange={handleChange}
              placeholder="e.g. Motor spark, blade jam, won't power on, wire cut..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#087F75]/20 resize-none ${
                errors.issue ? 'border-rose-500' : 'border-slate-200'
              }`}
            />
            {errors.issue && (
              <p className="text-xs font-semibold text-rose-600 mt-1">{errors.issue}</p>
            )}
          </div>
        </div>

        {/* Step 3: Media Uploads (Images & Videos) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-[#087F75] font-bold text-sm flex items-center justify-center">
              3
            </span>
            <div>
              <h2 className="font-bold text-base text-slate-900">Photos & Videos (Optional)</h2>
              <p className="text-sm font-medium text-slate-500">Attach photos or short video clip for rapid inspection.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image upload box */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-[#087F75] transition bg-slate-50">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                <ImageIcon className="w-8 h-8 text-[#087F75] mb-2" />
                <span className="text-sm font-bold text-slate-800">Upload Photos</span>
                <span className="text-xs font-semibold text-slate-500 mt-1">PNG, JPG up to 10MB</span>
                <span className="mt-3 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-[#087F75] hover:bg-slate-100">
                  Select Photos
                </span>
              </label>
            </div>

            {/* Video upload box */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-[#087F75] transition bg-slate-50">
              <input
                type="file"
                id="video-upload"
                multiple
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
              <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                <Video className="w-8 h-8 text-[#087F75] mb-2" />
                <span className="text-sm font-bold text-slate-800">Upload Video</span>
                <span className="text-xs font-semibold text-slate-500 mt-1">MP4, MOV demonstration</span>
                <span className="mt-3 px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-[#087F75] hover:bg-slate-100">
                  Select Video
                </span>
              </label>
            </div>
          </div>

          {/* Uploaded media previews */}
          {(images.length > 0 || videos.length > 0) && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-sm font-bold text-slate-700 mb-3">Attached Media ({images.length + videos.length})</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-50">
                    <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded truncate font-medium">
                      {img.name}
                    </span>
                  </div>
                ))}
                {videos.map((vid, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-square bg-slate-900 flex flex-col items-center justify-center p-2 text-white text-center">
                    <Video className="w-6 h-6 mb-1 text-teal-300" />
                    <span className="text-xs line-clamp-1 w-full px-1 font-medium">{vid.name}</span>
                    <button
                      type="button"
                      onClick={() => removeVideo(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Pickup & Address */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="w-8 h-8 rounded-full bg-teal-100 text-[#087F75] font-bold text-sm flex items-center justify-center">
              4
            </span>
            <h2 className="font-bold text-base text-slate-900">Pickup Details</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                Complete Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House / Flat No, Street, Landmark"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#087F75]/20 ${
                  errors.address ? 'border-rose-500' : 'border-slate-200'
                }`}
              />
              {errors.address && (
                <p className="text-xs font-semibold text-rose-600 mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#087F75]/20 ${
                    errors.city ? 'border-rose-500' : 'border-slate-200'
                  }`}
                />
                {errors.city && (
                  <p className="text-xs font-semibold text-rose-600 mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  placeholder="560001"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#087F75]/20 ${
                    errors.pincode ? 'border-rose-500' : 'border-slate-200'
                  }`}
                />
                {errors.pincode && (
                  <p className="text-xs font-semibold text-rose-600 mt-1">{errors.pincode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  Preferred Pickup Date *
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#087F75]/20 ${
                    errors.pickupDate ? 'border-rose-500' : 'border-slate-200'
                  }`}
                />
                {errors.pickupDate && (
                  <p className="text-xs font-semibold text-rose-600 mt-1">{errors.pickupDate}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/customer/overview')}
            className="px-6 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 rounded-xl bg-[#087F75] hover:bg-[#06635B] text-white font-bold text-sm transition shadow-md shadow-[#087F75]/30 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Booking...
              </>
            ) : (
              'Confirm & Book'
            )}
          </button>
        </div>
      </form>

      {/* Success Confirmation Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          navigate('/customer/my-repairs');
        }}
        title="Repair Booked Successfully!"
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-700">
              Your repair request has been sent to the workshop.
            </p>
            <div className="mt-3 p-3.5 bg-teal-50 border border-teal-200 rounded-xl inline-block">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">Tracking ID</span>
              <p className="text-xl font-black text-[#087F75]">{createdRepairId}</p>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">
            A courier will be assigned once the shop owner reviews your request.
          </p>
          <div className="pt-2 flex gap-3 justify-center">
            <button
              onClick={() => {
                setSuccessModalOpen(false);
                navigate('/customer/my-repairs');
              }}
              className="px-6 py-3 bg-[#087F75] text-white text-sm font-bold rounded-xl hover:bg-[#06635B] transition shadow-md shadow-[#087F75]/20 cursor-pointer"
            >
              Go to My Repairs
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NewRepairRequest;
