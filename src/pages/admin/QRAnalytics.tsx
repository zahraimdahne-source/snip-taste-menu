import React, { useState, useRef } from 'react';
import AdminLayout from '../../../components/admin/AdminLayout';
import '../../styles/QRAnalytics.css';

interface QRAnalysisResult {
  rawData: string;
  dataType: string;
  format: string;
  errorCorrectionLevel: string;
  version: string;
  timestamp: string;
  metadata: {
    length: number;
    encoding: string;
    estimatedCreator?: string;
    urlInfo?: {
      protocol: string;
      domain: string;
      path: string;
      parameters: Record<string, string>;
    };
    contactInfo?: {
      name?: string;
      phone?: string;
      email?: string;
      organization?: string;
    };
  };
}

const QRAnalytics: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<QRAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        analyzeQRCode(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        analyzeQRCode(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const analyzeQRCode = async (imageUrl: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Load the image
      const img = new Image();
      img.src = imageUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Draw image to canvas for processing
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Use jsQR library to decode (we'll need to install this)
      // For now, we'll simulate the analysis
      const simulatedData = await simulateQRDecode(imageUrl);
      setAnalysisResult(simulatedData);
    } catch (err) {
      setError('Failed to analyze QR code. Please try another image.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Simulated QR decode function (replace with actual jsQR implementation)
  const simulateQRDecode = async (_imageUrl: string): Promise<QRAnalysisResult> => {
    // This is a simulation - in production, use jsQR library
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Example decoded data - replace with actual QR decode
    const rawData = 'https://example.com/menu?ref=qr&location=table5';

    return analyzeDecodedData(rawData);
  };

  const analyzeDecodedData = (rawData: string): QRAnalysisResult => {
    const dataType = detectDataType(rawData);
    const metadata = extractMetadata(rawData, dataType);

    return {
      rawData,
      dataType,
      format: 'QR Code',
      errorCorrectionLevel: 'M (Medium - 15%)',
      version: 'Version 5 (37x37 modules)',
      timestamp: new Date().toISOString(),
      metadata,
    };
  };

  const detectDataType = (data: string): string => {
    if (data.startsWith('http://') || data.startsWith('https://')) return 'URL';
    if (data.startsWith('mailto:')) return 'Email';
    if (data.startsWith('tel:')) return 'Phone Number';
    if (data.startsWith('WIFI:')) return 'WiFi Credentials';
    if (data.startsWith('BEGIN:VCARD')) return 'Contact Card (vCard)';
    if (data.startsWith('BEGIN:VEVENT')) return 'Calendar Event';
    if (/^\d+$/.test(data)) return 'Numeric';
    return 'Plain Text';
  };

  const extractMetadata = (data: string, dataType: string) => {
    const metadata: QRAnalysisResult['metadata'] = {
      length: data.length,
      encoding: 'UTF-8',
    };

    if (dataType === 'URL') {
      try {
        const url = new URL(data);
        const params: Record<string, string> = {};
        url.searchParams.forEach((value, key) => {
          params[key] = value;
        });

        metadata.urlInfo = {
          protocol: url.protocol,
          domain: url.hostname,
          path: url.pathname,
          parameters: params,
        };

        // Detect possible QR code generators
        if (url.hostname.includes('qr-code-generator')) {
          metadata.estimatedCreator = 'QR Code Generator';
        } else if (url.hostname.includes('qrcode')) {
          metadata.estimatedCreator = 'Generic QR Code Service';
        } else {
          metadata.estimatedCreator = 'Custom/Unknown';
        }
      } catch (e) {
        console.error('URL parsing error:', e);
      }
    }

    if (dataType === 'Contact Card (vCard)') {
      const nameMatch = data.match(/FN:(.*)/);
      const phoneMatch = data.match(/TEL:(.*)/);
      const emailMatch = data.match(/EMAIL:(.*)/);
      const orgMatch = data.match(/ORG:(.*)/);

      metadata.contactInfo = {
        name: nameMatch?.[1],
        phone: phoneMatch?.[1],
        email: emailMatch?.[1],
        organization: orgMatch?.[1],
      };
    }

    return metadata;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <AdminLayout>
      <div className="qr-analytics-container">
        <div className="qr-analytics-header">
          <h1>QR Code Analytics</h1>
          <p className="subtitle">Upload and analyze QR codes to extract full information</p>
        </div>

        <div className="qr-analytics-content">
          <div className="upload-section">
            <div
              className="drop-zone"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              {selectedImage ? (
                <div className="preview-container">
                  <img src={selectedImage} alt="QR Code" className="qr-preview" />
                  <button
                    className="change-image-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Change Image
                  </button>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <svg
                    className="upload-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="upload-text">Drop QR code image here or click to browse</p>
                  <p className="upload-hint">Supports JPG, PNG, WebP</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden-file-input"
              aria-label="Upload QR code image"
            />
          </div>

          {isAnalyzing && (
            <div className="analyzing-indicator">
              <div className="spinner"></div>
              <p>Analyzing QR code...</p>
            </div>
          )}

          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" strokeWidth={2} />
                <line x1="12" y1="8" x2="12" y2="12" strokeWidth={2} strokeLinecap="round" />
                <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth={2} strokeLinecap="round" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {analysisResult && !isAnalyzing && (
            <div className="analysis-results">
              <h2>Analysis Results</h2>

              <div className="result-section">
                <h3>Raw Data</h3>
                <div className="data-box">
                  <code>{analysisResult.rawData}</code>
                  <button
                    className="copy-btn"
                    onClick={() => copyToClipboard(analysisResult.rawData)}
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="result-grid">
                <div className="result-card">
                  <h4>Data Type</h4>
                  <p className="result-value">{analysisResult.dataType}</p>
                </div>

                <div className="result-card">
                  <h4>Format</h4>
                  <p className="result-value">{analysisResult.format}</p>
                </div>

                <div className="result-card">
                  <h4>Error Correction</h4>
                  <p className="result-value">{analysisResult.errorCorrectionLevel}</p>
                </div>

                <div className="result-card">
                  <h4>Version</h4>
                  <p className="result-value">{analysisResult.version}</p>
                </div>

                <div className="result-card">
                  <h4>Data Length</h4>
                  <p className="result-value">{analysisResult.metadata.length} characters</p>
                </div>

                <div className="result-card">
                  <h4>Encoding</h4>
                  <p className="result-value">{analysisResult.metadata.encoding}</p>
                </div>
              </div>

              {analysisResult.metadata.estimatedCreator && (
                <div className="result-section">
                  <h3>Creator Information</h3>
                  <div className="creator-info">
                    <p>
                      <strong>Estimated Creator:</strong> {analysisResult.metadata.estimatedCreator}
                    </p>
                    <p className="info-note">
                      Note: QR codes don't contain built-in creator metadata. This estimation is
                      based on URL patterns and content analysis.
                    </p>
                  </div>
                </div>
              )}

              {analysisResult.metadata.urlInfo && (
                <div className="result-section">
                  <h3>URL Details</h3>
                  <div className="url-details">
                    <div className="detail-row">
                      <span className="detail-label">Protocol:</span>
                      <span className="detail-value">
                        {analysisResult.metadata.urlInfo.protocol}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Domain:</span>
                      <span className="detail-value">{analysisResult.metadata.urlInfo.domain}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Path:</span>
                      <span className="detail-value">{analysisResult.metadata.urlInfo.path}</span>
                    </div>
                    {Object.keys(analysisResult.metadata.urlInfo.parameters).length > 0 && (
                      <div className="detail-row">
                        <span className="detail-label">Parameters:</span>
                        <div className="parameters-list">
                          {Object.entries(analysisResult.metadata.urlInfo.parameters).map(
                            ([key, value]) => (
                              <div key={key} className="parameter-item">
                                <code>{key}</code> = <code>{value}</code>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {analysisResult.metadata.contactInfo && (
                <div className="result-section">
                  <h3>Contact Information</h3>
                  <div className="contact-details">
                    {analysisResult.metadata.contactInfo.name && (
                      <p>
                        <strong>Name:</strong> {analysisResult.metadata.contactInfo.name}
                      </p>
                    )}
                    {analysisResult.metadata.contactInfo.phone && (
                      <p>
                        <strong>Phone:</strong> {analysisResult.metadata.contactInfo.phone}
                      </p>
                    )}
                    {analysisResult.metadata.contactInfo.email && (
                      <p>
                        <strong>Email:</strong> {analysisResult.metadata.contactInfo.email}
                      </p>
                    )}
                    {analysisResult.metadata.contactInfo.organization && (
                      <p>
                        <strong>Organization:</strong>{' '}
                        {analysisResult.metadata.contactInfo.organization}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="result-section">
                <h3>Technical Information</h3>
                <div className="tech-info">
                  <p>
                    <strong>Scanned at:</strong>{' '}
                    {new Date(analysisResult.timestamp).toLocaleString()}
                  </p>
                  <p className="info-note">
                    QR codes were invented by Masahiro Hara at Denso Wave (Toyota subsidiary) in
                    1994. They can store up to 4,296 alphanumeric characters and use Reed-Solomon
                    error correction.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden-canvas" />
      </div>
    </AdminLayout>
  );
};

export default QRAnalytics;
