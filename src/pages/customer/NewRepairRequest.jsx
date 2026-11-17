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
        <h1 className="text-2xl font-bold text-primary-text font-heading">
          Book a New Appliance Repair
        </h1>
        <p className="text-secondary-text text-sm mt-1">
          Tell us about the issue and choose a pickup date. Our verified technicians will take care of the rest.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Customer Contact Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="w-7 h-7 rounded-full bg-brand-accent text-brand-primary font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="font-semibold text-primary-text">Customer Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                  errors.customerName ? 'border-danger-text' : 'border-gray-200'
                }`}
              />
              {errors.customerName && (
                <p className="text-xs text-danger-text mt-1">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                  errors.customerPhone ? 'border-danger-text' : 'border-gray-200'
                }`}
              />
              {errors.customerPhone && (
                <p className="text-xs text-danger-text mt-1">{errors.customerPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="rahul@example.com"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                  errors.customerEmail ? 'border-danger-text' : 'border-gray-200'
                }`}
              />
              {errors.customerEmail && (
                <p className="text-xs text-danger-text mt-1">{errors.customerEmail}</p>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: Appliance Details */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="w-7 h-7 rounded-full bg-brand-accent text-brand-primary font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="font-semibold text-primary-text">Appliance Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Appliance Category *
              </label>
              <select
                name="appliance"
                value={formData.appliance}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 bg-white"
              >
                {APPLIANCE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Brand / Manufacturer *
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Philips, Samsung, Preethi"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                  errors.brand ? 'border-danger-text' : 'border-gray-200'
                }`}
              />
              {errors.brand && (
                <p className="text-xs text-danger-text mt-1">{errors.brand}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Model Number (optional)
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. HL7756/00 or leave blank"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
              >
              </input>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-primary-text mb-1.5">
              Problem Description *
            </label>
            <textarea
              name="issue"
              rows={4}
              value={formData.issue}
              onChange={handleChange}
              placeholder="Describe symptoms, noise, burning smell, won't turn on, sparks, or intermittent power loss..."
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 resize-none ${
                errors.issue ? 'border-danger-text' : 'border-gray-200'
              }`}
            />
            {errors.issue && (
              <p className="text-xs text-danger-text mt-1">{errors.issue}</p>
            )}
          </div>
        </div>

        {/* Step 3: Media Uploads (Images & Videos) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="w-7 h-7 rounded-full bg-brand-accent text-brand-primary font-bold text-xs flex items-center justify-center">
              3
            </span>
            <div>
              <h2 className="font-semibold text-primary-text">Photos & Video Evidence (Optional)</h2>
              <p className="text-xs text-secondary-text">Helps technicians diagnose faults and give accurate cost estimates.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image upload box */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-brand-primary transition bg-bg-light/40">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                <ImageIcon className="w-8 h-8 text-brand-primary mb-2" />
                <span className="text-xs font-medium text-primary-text">Upload Appliance Photos</span>
                <span className="text-[11px] text-secondary-text mt-1">PNG, JPG up to 10MB</span>
                <span className="mt-3 px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-brand-primary hover:bg-gray-50">
                  Select Photos
                </span>
              </label>
            </div>

            {/* Video upload box */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-brand-primary transition bg-bg-light/40">
              <input
                type="file"
                id="video-upload"
                multiple
                accept="video/*"
                onChange={handleVideoUpload}
                className="hidden"
              />
              <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
                <Video className="w-8 h-8 text-brand-primary mb-2" />
                <span className="text-xs font-medium text-primary-text">Upload Video of Problem</span>
                <span className="text-[11px] text-secondary-text mt-1">MP4, MOV short demonstration</span>
                <span className="mt-3 px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-brand-primary hover:bg-gray-50">
                  Select Video
                </span>
              </label>
            </div>
          </div>

          {/* Uploaded media previews */}
          {(images.length > 0 || videos.length > 0) && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-secondary-text mb-3">Attached Media ({images.length + videos.length})</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                    <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-danger-text text-white rounded-full transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded truncate">
                      {img.name}
                    </span>
                  </div>
                ))}
                {videos.map((vid, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-brand-secondary/90 flex flex-col items-center justify-center p-2 text-white text-center">
                    <Video className="w-6 h-6 mb-1 text-brand-accent" />
                    <span className="text-[10px] line-clamp-1 w-full px-1">{vid.name}</span>
                    <button
                      type="button"
                      onClick={() => removeVideo(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-danger-text text-white rounded-full transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Pickup & Address */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="w-7 h-7 rounded-full bg-brand-accent text-brand-primary font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h2 className="font-semibold text-primary-text">Pickup Address & Date</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-primary-text mb-1.5">
                Complete Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Flat / House No, Building, Street, Landmark"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                  errors.address ? 'border-danger-text' : 'border-gray-200'
                }`}
              />
              {errors.address && (
                <p className="text-xs text-danger-text mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-primary-text mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                    errors.city ? 'border-danger-text' : 'border-gray-200'
                  }`}
                />
                {errors.city && (
                  <p className="text-xs text-danger-text mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-primary-text mb-1.5">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  placeholder="560001"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                    errors.pincode ? 'border-danger-text' : 'border-gray-200'
                  }`}
                />
                {errors.pincode && (
                  <p className="text-xs text-danger-text mt-1">{errors.pincode}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-primary-text mb-1.5">
                  Preferred Pickup Date *
                </label>
                <input
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={handleChange}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20 ${
                    errors.pickupDate ? 'border-danger-text' : 'border-gray-200'
                  }`}
                />
                {errors.pickupDate && (
                  <p className="text-xs text-danger-text mt-1">{errors.pickupDate}</p>
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
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-secondary-text hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-7 py-2.5 rounded-xl bg-brand-primary hover:bg-opacity-90 text-white font-medium text-sm transition shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registering Complaint...
              </>
            ) : (
              'Confirm & Book Repair'
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
        title="Repair Request Submitted!"
      >
        <div className="space-y-4 text-center py-2">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-success-text">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-secondary-text">
              Your appliance repair request has been successfully registered and sent to the shop owner.
            </p>
            <div className="mt-3 p-3 bg-brand-accent/50 rounded-xl inline-block">
              <span className="text-xs text-secondary-text">Your Tracking ID:</span>
              <p className="text-lg font-bold text-brand-primary">{createdRepairId}</p>
            </div>
          </div>
          <p className="text-xs text-secondary-text">
            A courier will be dispatched for pickup once the shop owner reviews and approves the request.
          </p>
          <div className="pt-2 flex gap-3 justify-center">
            <button
              onClick={() => {
                setSuccessModalOpen(false);
                navigate('/customer/my-repairs');
              }}
              className="px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold rounded-xl hover:bg-opacity-90 transition"
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
