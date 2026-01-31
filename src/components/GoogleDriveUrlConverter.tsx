'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function GoogleDriveUrlConverter() {
  const [inputUrl, setInputUrl] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const extractAndConvert = (url: string) => {
    // Extract the file ID from the URL
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      const fileId = match[1];
      const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
      setOutputUrl(downloadUrl);
      return downloadUrl;
    }
    setOutputUrl('');
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputUrl(value);
    extractAndConvert(value);
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
      <h3 className="font-semibold mb-4">Google Drive Direct Link Converter</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Paste your Google Drive Share Link:
          </label>
          <input
            type="text"
            value={inputUrl}
            onChange={handleInputChange}
            placeholder="https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing"
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
