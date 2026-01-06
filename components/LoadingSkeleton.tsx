import React from 'react';

export const CardSkeleton: React.FC = () => (
  <div className="skeleton skeleton-card" style={{ marginBottom: '16px' }} />
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} style={{ display: 'flex', gap: '16px' }} className="skeleton">
        <div className="skeleton skeleton-text" style={{ flex: 1, height: '48px' }} />
        <div className="skeleton skeleton-text" style={{ width: '100px', height: '48px' }} />
      </div>
    ))}
  </div>
);

export const TextSkeleton: React.FC<{ width?: string }> = ({ width = '100%' }) => (
  <div className="skeleton skeleton-text" style={{ width, height: '16px', marginBottom: '8px' }} />
);

export const TitleSkeleton: React.FC = () => (
  <div
    className="skeleton skeleton-title"
    style={{ width: '60%', height: '24px', marginBottom: '12px' }}
  />
);

export const ButtonSkeleton: React.FC = () => (
  <div className="skeleton" style={{ width: '120px', height: '48px', borderRadius: '12px' }} />
);

export const ImageSkeleton: React.FC<{ width?: string; height?: string }> = ({
  width = '100px',
  height = '100px',
}) => <div className="skeleton" style={{ width, height, borderRadius: '8px' }} />;
