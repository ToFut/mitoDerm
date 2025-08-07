'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FiCheckCircle, FiXCircle, FiClock, FiSearch, FiFilter, FiEye, FiMail, FiCalendar, FiUser, FiMessageSquare } from 'react-icons/fi';
import styles from './CertificationsManager.module.scss';

interface CertificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: Date;
  responseDate?: Date;
  adminResponse?: string;
  requestType: 'certification' | 'meeting' | 'custom';
  requestDetails: string;
  adminNotes?: string;
}

export default function CertificationsManager() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<CertificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CertificationRequest | null>(null);
  const [responseText, setResponseText] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    const mockRequests: CertificationRequest[] = [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        status: 'pending',
        requestDate: new Date('2024-07-10'),
        requestType: 'certification',
        requestDetails: 'I would like to request certification for MitoDerm products. I have completed the training and would like to start selling products to my clients.'
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        status: 'approved',
        requestDate: new Date('2024-07-08'),
        responseDate: new Date('2024-07-09'),
        requestType: 'meeting',
        requestDetails: 'I would like to schedule a meeting to discuss certification requirements and product training.',
        adminResponse: 'Approved! Meeting scheduled for July 15th at 2 PM.',
        adminNotes: 'User shows good understanding of products'
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Bob Johnson',
        userEmail: 'bob@example.com',
        status: 'rejected',
        requestDate: new Date('2024-07-05'),
        responseDate: new Date('2024-07-06'),
        requestType: 'custom',
        requestDetails: 'I have a special request regarding bulk ordering and custom pricing.',
        adminResponse: 'Request denied. Please contact sales team for bulk orders.',
        adminNotes: 'Not eligible for bulk pricing'
      }
    ];
    setRequests(mockRequests);
    setLoading(false);
  }, []);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestDetails.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus;
    const matchesType = selectedType === 'all' || request.requestType === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleResponse = (request: CertificationRequest, status: 'approved' | 'rejected') => {
    setSelectedRequest(request);
    setResponseText('');
    setShowResponseModal(true);
  };

  const submitResponse = () => {
    if (!selectedRequest || !responseText.trim()) return;

    const updatedRequest = {
      ...selectedRequest,
      status: selectedRequest.status === 'pending' ? 'approved' : selectedRequest.status,
      responseDate: new Date(),
      adminResponse: responseText,
      adminNotes: responseText
    };

    setRequests(requests.map(req => 
      req.id === selectedRequest.id ? updatedRequest : req
    ));
    setShowResponseModal(false);
    setSelectedRequest(null);
    setResponseText('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#48bb78';
      case 'rejected': return '#e53e3e';
      case 'pending': return '#ed8936';
      default: return '#999';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'certification': return <FiCheckCircle />;
      case 'meeting': return <FiCalendar />;
      case 'custom': return <FiMessageSquare />;
      default: return <FiUser />;
    }
  };

  if (!session) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.certificationsManager}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Certifications Management</h1>
          <p>Review and manage certification requests</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{requests.length}</span>
              <span className={styles.statLabel}>Total Requests</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{requests.filter(r => r.status === 'pending').length}</span>
              <span className={styles.statLabel}>Pending</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>{requests.filter(r => r.status === 'approved').length}</span>
              <span className={styles.statLabel}>Approved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchFilter}>
          <div className={styles.searchBox}>
            <FiSearch />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Types</option>
            <option value="certification">Certification</option>
            <option value="meeting">Meeting</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading requests...</p>
        </div>
      ) : (
        <div className={styles.requestsList}>
          {filteredRequests.map(request => (
            <div key={request.id} className={styles.requestCard}>
              <div className={styles.requestHeader}>
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    {request.userName.charAt(0)}
                  </div>
                  <div className={styles.userDetails}>
                    <h4>{request.userName}</h4>
                    <p>{request.userEmail}</p>
                  </div>
                </div>
                <div className={styles.requestMeta}>
                  <span 
                    className={styles.statusBadge}
                    style={{ background: `${getStatusColor(request.status)}22`, color: getStatusColor(request.status) }}
                  >
                    {request.status}
                  </span>
                  <span className={styles.typeBadge}>
                    {getTypeIcon(request.requestType)}
                    {request.requestType}
                  </span>
                </div>
              </div>
              
              <div className={styles.requestContent}>
                <p className={styles.requestDetails}>{request.requestDetails}</p>
                <div className={styles.requestDate}>
                  <FiCalendar />
                  <span>Requested: {request.requestDate.toLocaleDateString()}</span>
                </div>
                {request.responseDate && (
                  <div className={styles.responseDate}>
                    <FiCalendar />
                    <span>Responded: {request.responseDate.toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {request.adminResponse && (
                <div className={styles.adminResponse}>
                  <h5>Admin Response:</h5>
                  <p>{request.adminResponse}</p>
                </div>
              )}

              <div className={styles.requestActions}>
                <button className={styles.actionBtn} title="View Details">
                  <FiEye />
                </button>
                <button className={styles.actionBtn} title="Send Email">
                  <FiMail />
                </button>
                {request.status === 'pending' && (
                  <>
                    <button 
                      className={`${styles.actionBtn} ${styles.approveBtn}`}
                      onClick={() => handleResponse(request, 'approved')}
                      title="Approve"
                    >
                      <FiCheckCircle />
                    </button>
                    <button 
                      className={`${styles.actionBtn} ${styles.rejectBtn}`}
                      onClick={() => handleResponse(request, 'rejected')}
                      title="Reject"
                    >
                      <FiXCircle />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredRequests.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <FiCheckCircle />
          </div>
          <h3>No requests found</h3>
          <p>No certification requests match your current filters</p>
        </div>
      )}

      {/* Response Modal */}
      {showResponseModal && selectedRequest && (
        <div className={styles.modalOverlay} onClick={() => setShowResponseModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Respond to Request</h2>
              <button onClick={() => setShowResponseModal(false)} className={styles.closeBtn}>
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.requestSummary}>
                <h4>Request from {selectedRequest.userName}</h4>
                <p>{selectedRequest.requestDetails}</p>
              </div>
              <div className={styles.responseForm}>
                <label>Your Response:</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Enter your response..."
                  rows={4}
                />
              </div>
            </div>
            <div className={styles.modalActions}>
              <button onClick={() => setShowResponseModal(false)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={submitResponse} className={styles.submitBtn}>
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 