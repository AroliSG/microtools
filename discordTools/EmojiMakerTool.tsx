import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Upload, Download, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FieldLabel, PrimaryButton, ToolCard, ToolHeader, ToolShell } from './ui';

const MAX_DISCORD_EMOJI_BYTES = 256 * 1024;

type OutputFormat = 'png' | 'webp' | 'jpeg';
type FitMode = 'cover' | 'contain';

const FORMAT_MIME: Record<OutputFormat, string> = {
  png: 'image/png',
  webp: 'image/webp',
  jpeg: 'image/jpeg',
};

const EmojiMakerTool: React.FC = () => {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [resultSize, setResultSize] = useState(0);
  const [resultFormat, setResultFormat] = useState<OutputFormat>('webp');
  const [targetSize, setTargetSize] = useState(128);
  const [fit, setFit] = useState<FitMode>('cover');
  const [quality, setQuality] = useState(0.9);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isReady = useMemo(() => resultSize > 0 && resultUrl.length > 0, [resultSize, resultUrl]);
  const isDiscordSafe = resultSize > 0 && resultSize <= MAX_DISCORD_EMOJI_BYTES;

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    };
  }, [sourceUrl]);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const loadImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Could not load the selected image.'));
      image.src = url;
    });

  const canvasToBlob = (canvas: HTMLCanvasElement, format: OutputFormat, q: number): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const mime = FORMAT_MIME[format];
      const encoderQuality = format === 'png' ? undefined : q;
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Could not encode output image.'));
            return;
          }
          resolve(blob);
        },
        mime,
        encoderQuality,
      );
    });

  const renderCanvas = (
    image: HTMLImageElement,
    size: number,
    format: OutputFormat,
    fitMode: FitMode,
  ): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas is not supported in this browser.');
    }

    if (format === 'jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
    } else {
      ctx.clearRect(0, 0, size, size);
    }

    const scale = fitMode === 'cover'
      ? Math.max(size / image.width, size / image.height)
      : Math.min(size / image.width, size / image.height);

    const drawWidth = Math.round(image.width * scale);
    const drawHeight = Math.round(image.height * scale);
    const dx = Math.floor((size - drawWidth) / 2);
    const dy = Math.floor((size - drawHeight) / 2);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, dx, dy, drawWidth, drawHeight);
    return canvas;
  };

  const processImage = async () => {
    if (!sourceUrl) return;

    setProcessing(true);
    setError('');

    try {
      const image = await loadImage(sourceUrl);

      let bestBlob: Blob | null = null;
      let bestSize = targetSize;
      let q = quality;

      for (let size = targetSize; size >= 48; size -= 8) {
        const canvas = renderCanvas(image, size, resultFormat, fit);
        q = quality;
        let blob = await canvasToBlob(canvas, resultFormat, q);

        if ((resultFormat === 'webp' || resultFormat === 'jpeg') && blob.size > MAX_DISCORD_EMOJI_BYTES) {
          for (let i = 0; i < 12 && blob.size > MAX_DISCORD_EMOJI_BYTES; i += 1) {
            q = Math.max(0.3, q - 0.05);
            blob = await canvasToBlob(canvas, resultFormat, q);
          }
        }

        bestBlob = blob;
        bestSize = size;

        if (blob.size <= MAX_DISCORD_EMOJI_BYTES) break;
      }

      if (!bestBlob) {
        throw new Error('Could not generate emoji output.');
      }

      if (resultUrl) URL.revokeObjectURL(resultUrl);
      const outUrl = URL.createObjectURL(bestBlob);
      setResultUrl(outUrl);
      setResultSize(bestBlob.size);
      if (bestSize !== targetSize) setTargetSize(bestSize);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to process image.';
      setError(message);
      setResultUrl('');
      setResultSize(0);
    } finally {
      setProcessing(false);
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    const nextUrl = URL.createObjectURL(file);
    setSourceFile(file);
    setSourceUrl(nextUrl);
    setResultUrl('');
    setResultSize(0);
    setError('');
  };

  const download = () => {
    if (!resultUrl || !sourceFile) return;
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = `emoji-${targetSize}px.${resultFormat}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <ToolShell>
      <ToolHeader title="Emoji Maker" description="Convert any image into a Discord-ready emoji file (max 256 KB)." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ToolCard className="space-y-5">
          <div>
            <FieldLabel>Upload Image</FieldLabel>
            <label className="w-full h-32 border-2 border-dashed border-[#4E5058] rounded-xl bg-[#1E1F22] hover:border-[#5865F2] transition-colors cursor-pointer flex flex-col items-center justify-center text-[#B5BAC1]">
              <Upload size={18} />
              <span className="text-sm mt-2">Click to choose image</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onClick={(e) => {
                  e.currentTarget.value = '';
                }}
                onChange={onFileChange}
              />
            </label>
            {sourceFile && <p className="mt-2 text-xs text-[#B5BAC1]">Source: {sourceFile.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#B5BAC1] uppercase mb-2">Output Format</label>
              
              <select
                value={resultFormat}
                onChange={(e) => setResultFormat(e.target.value as OutputFormat)}
                className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-white"
              >
                <option value="webp">WEBP</option>
                <option value="png">PNG</option>
                <option value="jpeg">JPEG</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#B5BAC1] uppercase mb-2">Canvas Size</label>
              <select
                value={targetSize}
                onChange={(e) => setTargetSize(Number(e.target.value))}
                className="w-full bg-[#1E1F22] border border-[#1E1F22] focus:border-[#5865F2] rounded-lg p-3 text-white"
              >
                {[64, 96, 128, 160, 192, 256].map((s) => (
                  <option key={s} value={s}>{s}px</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFit('cover')}
              className={`py-2 rounded-lg text-xs font-bold border transition-colors ${fit === 'cover' ? 'bg-[#5865F2] border-[#5865F2] text-white' : 'bg-[#1E1F22] border-transparent text-[#B5BAC1]'}`}
            >
              Fill (Cover)
            </button>
            <button
              onClick={() => setFit('contain')}
              className={`py-2 rounded-lg text-xs font-bold border transition-colors ${fit === 'contain' ? 'bg-[#5865F2] border-[#5865F2] text-white' : 'bg-[#1E1F22] border-transparent text-[#B5BAC1]'}`}
            >
              Fit (Contain)
            </button>
          </div>

          {(resultFormat === 'webp' || resultFormat === 'jpeg') && (
            <div>
              <label className="block text-[10px] font-bold text-[#B5BAC1] uppercase mb-2">Quality ({Math.round(quality * 100)}%)</label>
              <input
                type="range"
                min={40}
                max={100}
                value={Math.round(quality * 100)}
                onChange={(e) => setQuality(Number(e.target.value) / 100)}
                className="w-full"
              />
            </div>
          )}

          <PrimaryButton
            onClick={processImage}
            disabled={!sourceUrl || processing}
            className="inline-flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} className={processing ? 'animate-spin' : ''} />
            {processing ? 'Processing...' : 'Generate Emoji'}
          </PrimaryButton>

          {error && (
            <div className="flex items-center gap-2 text-xs p-3 rounded-lg bg-[#ED4245]/10 border border-[#ED4245]/20 text-[#ED4245]">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </ToolCard>

        <ToolCard className="flex flex-col items-center justify-center text-center">
          {isReady ? (
            <div className="w-full space-y-5">
              <img src={resultUrl} alt="Emoji output" className="w-40 h-40 mx-auto rounded-xl bg-[#1E1F22] object-contain p-3" />
              <div className={`text-xs px-3 py-2 rounded-lg border ${isDiscordSafe ? 'text-[#23A559] border-[#23A559]/30 bg-[#23A559]/10' : 'text-[#F0B132] border-[#F0B132]/30 bg-[#F0B132]/10'}`}>
                Size: {(resultSize / 1024).toFixed(1)} KB / 256 KB
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-[#B5BAC1]">
                {isDiscordSafe ? <CheckCircle2 size={14} className="text-[#23A559]" /> : <AlertCircle size={14} className="text-[#F0B132]" />}
                {isDiscordSafe ? 'Ready to upload to Discord' : 'Too large, lower size/quality and regenerate'}
              </div>
              <PrimaryButton
                onClick={download}
                disabled={!isDiscordSafe}
                className="inline-flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download Emoji
              </PrimaryButton>
            </div>
          ) : (
            <div className="text-[#B5BAC1]">
              <p className="text-sm">Upload an image and generate a Discord-compatible emoji file.</p>
            </div>
          )}
        </ToolCard>
      </div>
    </ToolShell>
  );
};

export default EmojiMakerTool;
