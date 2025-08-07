"use client";
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { 
  FiAward, 
  FiUpload, 
  FiFile, 
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiHome
} from 'react-icons/fi';
import styles from './CertificationRequest.module.scss';

interface CertificationRequestProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface Document {
  id: string;
  name: string;
  file: File;
  url?: string;
}

export default function CertificationRequest({ onSuccess, onError }: CertificationRequestProps) {
  const t = useTranslations("certification");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    certificationLevel: 'basic' as 'basic' | 'advanced' | 'expert',
    profession: '',
    clinic: '',
    phone: '',
    address: '',
    experience: '',
    education: '',
    motivation: ''
  });
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const newDocuments: Document[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const document: Document = {
          id: `doc_${Date.now()}_${i}`,
          name: file.name,
          file: file
        };
        
        // Upload to Firebase Storage (you'll need to implement this)
        // const url = await uploadDocument(file);
        // document.url = url;
        
        newDocuments.push(document);
      }
      
      setDocuments(prev => [...prev, ...newDocuments]);
    } catch (error) {
      console.error('Error uploading documents:', error);
      onError?.('Failed to upload documents');
    } finally {
      setUploading(false);
    }
  };

  const removeDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  const handleSubmit = async () => {
    if (!formData.profession || !formData.motivation) {
      onError?.('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/certifications/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          certificationLevel: formData.certificationLevel,
          userProfile: {
            profession: formData.profession,
            clinic: formData.clinic,
            phone: formData.phone,
            address: formData.address
          },
          documents: documents.map(doc => ({
            name: doc.name,
            url: doc.url || ''
          }))
        }),
      });

      if (response.ok) {
        setStep(3); // Success step
        onSuccess?.();
      } else {
        const error = await response.json();
        onError?.(error.error || 'Failed to submit certification request');
      }
    } catch (error) {
      console.error('Error submitting certification request:', error);
      onError?.('Failed to submit certification request');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.profession || !formData.motivation)) {
      onError?.('Please fill in all required fields');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className={styles.certificationRequest}>
      <div className={styles.header}>
        <FiAward className={styles.icon} />
        <h2>Professional Certification Request</h2>
        <p>Complete your profile and submit required documents to become a certified professional</p>
      </div>

      <div className={styles.progress}>
        <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
          <span className={styles.stepNumber}>1</span>
          <span className={styles.stepLabel}>Basic Info</span>
        </div>
        <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
          <span className={styles.stepNumber}>2</span>
          <span className={styles.stepLabel}>Documents</span>
        </div>
        <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
          <span className={styles.stepNumber}>3</span>
          <span className={styles.stepLabel}>Complete</span>
        </div>
      </div>

      {step === 1 && (
        <div className={styles.stepContent}>
          <h3>Professional Information</h3>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>
                <FiUser /> Profession *
              </label>
              <input
                type="text"
                value={formData.profession}
                onChange={(e) => handleInputChange('profession', e.target.value)}
                placeholder="e.g., Dermatologist, Aesthetician"
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <FiHome /> Clinic/Hospital
              </label>
              <input
                type="text"
                value={formData.clinic}
                onChange={(e) => handleInputChange('clinic', e.target.value)}
                placeholder="Your clinic or hospital name"
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <FiPhone /> Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1-234-567-8900"
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                <FiMapPin /> Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Your practice address"
                className={styles.formInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Certification Level</label>
            <select
              value={formData.certificationLevel}
              onChange={(e) => handleInputChange('certificationLevel', e.target.value)}
              className={styles.formSelect}
            >
              <option value="basic">Basic Certification</option>
              <option value="advanced">Advanced Certification</option>
              <option value="expert">Expert Certification</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Professional Experience</label>
            <textarea
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="Describe your professional experience and background..."
              className={styles.formTextarea}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Education & Training</label>
            <textarea
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value)}
              placeholder="List your relevant education, training, and certifications..."
              className={styles.formTextarea}
              rows={3}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Motivation for Certification *</label>
            <textarea
              value={formData.motivation}
              onChange={(e) => handleInputChange('motivation', e.target.value)}
              placeholder="Why do you want to become certified? How will this benefit your practice and patients?"
              className={styles.formTextarea}
              rows={4}
            />
          </div>

          <div className={styles.stepActions}>
            <button
              onClick={nextStep}
              className={styles.nextButton}
              disabled={!formData.profession || !formData.motivation}
            >
              Next Step
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className={styles.stepContent}>
          <h3>Required Documents</h3>
          <p>Please upload the following documents to support your certification request:</p>

          <div className={styles.uploadSection}>
            <div className={styles.uploadArea}>
              <FiUpload className={styles.uploadIcon} />
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className={styles.fileInput}
                disabled={uploading}
              />
              <div className={styles.uploadText}>
                <p>Drag and drop files here or click to browse</p>
                <p className={styles.uploadHint}>
                  Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
                </p>
              </div>
            </div>
          </div>

          {documents.length > 0 && (
            <div className={styles.documentsList}>
              <h4>Uploaded Documents</h4>
              {documents.map((doc) => (
                <div key={doc.id} className={styles.documentItem}>
                  <FiFile className={styles.documentIcon} />
                  <span className={styles.documentName}>{doc.name}</span>
                  <button
                    onClick={() => removeDocument(doc.id)}
                    className={styles.removeDocument}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className={styles.requiredDocuments}>
            <h4>Recommended Documents</h4>
            <ul>
              <li>Professional license or certification</li>
              <li>Medical degree or relevant qualifications</li>
              <li>Proof of professional experience</li>
              <li>Continuing education certificates</li>
              <li>Professional references</li>
            </ul>
          </div>

          <div className={styles.stepActions}>
            <button onClick={prevStep} className={styles.prevButton}>
              Previous Step
            </button>
            <button
              onClick={handleSubmit}
              className={styles.submitButton}
              disabled={loading || uploading}
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={styles.stepContent}>
          <div className={styles.successMessage}>
            <FiCheckCircle className={styles.successIcon} />
            <h3>Request Submitted Successfully!</h3>
            <p>Your certification request has been submitted and is under review.</p>
            
            <div className={styles.nextSteps}>
              <h4>What happens next?</h4>
              <ol>
                <li>Our team will review your application within 2-3 business days</li>
                <li>You may be contacted to schedule a meeting or provide additional information</li>
                <li>Once approved, you'll receive your certification and access to professional features</li>
                <li>You can track your application status in your profile</li>
              </ol>
            </div>

            <div className={styles.contactInfo}>
              <p>Questions? Contact us at <strong>certification@mitoderm.com</strong></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 