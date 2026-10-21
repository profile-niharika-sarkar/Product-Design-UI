import type { ReactNode } from 'react';
import { ApiError } from '../lib/api';

export function Loading({ lines = 4, label = 'Loading' }: { lines?: number; label?: string }) {
  return (
    <div role="status" aria-label={label}>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="skeleton" style={{ width: `${90 - i * 12}%` }} />
      ))}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  if (error instanceof ApiError && error.status === 403)
    return <PermissionDenied message={error.message} />;
  return (
    <div className="state error" role="alert">
      <h3>Couldn’t load this</h3>
      <p className="small">{error.message}</p>
      {onRetry && (
        <button className="btn sm" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export function PermissionDenied({ message }: { message: string }) {
  return (
    <div className="state denied" role="alert">
      <h3>You don’t have permission for this</h3>
      <p className="small" style={{ marginBottom: 0 }}>
        {message}
      </p>
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="state">
      <h3>{title}</h3>
      {children && <div className="small muted">{children}</div>}
    </div>
  );
}

export function StaleBanner({ children }: { children: ReactNode }) {
  return (
    <div className="banner" role="status">
      <span aria-hidden="true">◷</span>
      <div>{children}</div>
    </div>
  );
}
