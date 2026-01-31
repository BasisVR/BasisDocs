'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function UrlConverter() {
  const [mode, setMode] = useState<'google-drive' | 'custom-domain'>('google-drive');
  const [inputUrl, setInputUrl] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const encodeBase64Utf8 = (str: string) => {
    try {
      return btoa(encodeURIComponent(str));
    } catch {
      try {
        return btoa(str);
      } catch {
        return '';
      }
    }
  };

  const extractAndConvert = (url: string) => {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      let downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      if (inputPassword && inputPassword.length > 0) {
        const encoded = encodeBase64Utf8(inputPassword);
        if (encoded) downloadUrl = `${downloadUrl}#${encoded}`;
      }
      setOutputUrl(downloadUrl);
      return downloadUrl;
    }
    setOutputUrl('');
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputUrl(value);
    if (mode === 'google-drive') {
      extractAndConvert(value);
    } else {
      // For custom domain, just update the output URL directly
      let customUrl = value;
      if (inputPassword && inputPassword.length > 0) {
        const encoded = encodeBase64Utf8(inputPassword);
        if (encoded) customUrl = `${customUrl}#${encoded}`;
      }
      setOutputUrl(customUrl || '');
    }
    setCopied(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputPassword(value);
    // Recompute output using the existing URL and new password
    if (inputUrl) {
      if (mode === 'google-drive') {
        extractAndConvert(inputUrl);
      } else {
        // For custom domain, recompute with new password
        let customUrl = inputUrl;
        if (value && value.length > 0) {
          const encoded = encodeBase64Utf8(value);
          if (encoded) customUrl = `${inputUrl}#${encoded}`;
        }
        setOutputUrl(customUrl || '');
      }
    }
    setCopied(false);
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value as 'google-drive' | 'custom-domain';
    setMode(newMode);
    setInputUrl('');
    setInputPassword('');
    setOutputUrl('');
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (outputUrl) {
      await navigator.clipboard.writeText(outputUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-lg border border-fd-border bg-fd-card p-6 my-6">
      <h3 className="font-semibold mb-4">
        {mode === 'google-drive'
          ? 'Google Drive Direct Link Converter'
          : 'Custom URL Converter'}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Conversion Mode:
          </label>
          <select
            value={mode}
            onChange={handleModeChange}
            className="w-full px-3 py-2 border border-fd-border rounded-md bg-fd-background text-fd-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
          >
            <option value="google-drive">Google Drive Link</option>
            <option value="custom-domain">Custom Domain</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {mode === 'google-drive'
              ? 'Paste your Google Drive Share Link:'
              : 'Paste your Custom Domain URL:'}
          </label>
          <input
            type="text"
            value={inputUrl}
            onChange={handleInputChange}
            placeholder={
              mode === 'google-drive'
                ? 'https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing'
                : 'https://example.com/path/to/file'
            }
            className="w-full px-3 py-2 border border-fd-border rounded-md bg-fd-background text-fd-foreground placeholder-fd-muted-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Optional avatar password (will be base64-encoded and appended)
          </label>
          <input
            type="password"
            value={inputPassword}
            onChange={handlePasswordChange}
            placeholder="Optional password"
            className="w-full px-3 py-2 border border-fd-border rounded-md bg-fd-background text-fd-foreground placeholder-fd-muted-foreground focus:outline-none focus:ring-2 focus:ring-fd-primary"
          />
        </div>

        {outputUrl && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Direct Download Link:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={outputUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-fd-border rounded-md bg-fd-background text-fd-foreground"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-fd-primary text-fd-primary-foreground rounded-md hover:opacity-90 transition-opacity"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-fd-muted-foreground mt-2">
              Use this link as your <strong>BEE File URL</strong> in Basis
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
