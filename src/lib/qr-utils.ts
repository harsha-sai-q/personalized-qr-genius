
import QRCode from 'qrcode';

export interface QROptionsType {
  data: string;
  width?: number;
  color?: string;
  backgroundColor?: string;
  cornerRadius?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
}

export const DEFAULT_QR_OPTIONS: QROptionsType = {
  data: '',
  width: 300,
  color: '#000000',
  backgroundColor: '#FFFFFF',
  cornerRadius: 0,
  errorCorrectionLevel: 'M',
  margin: 4,
};

/**
 * Generate a QR code as a data URL
 */
export const generateQRCode = async (options: QROptionsType): Promise<string> => {
  try {
    const qrOptions = {
      width: options.width,
      margin: options.margin,
      color: {
        dark: options.color,
        light: options.backgroundColor,
      },
      errorCorrectionLevel: options.errorCorrectionLevel,
    };

    const dataUrl = await QRCode.toDataURL(options.data, qrOptions);
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate QR code as SVG string
 */
export const generateQRCodeSVG = async (options: QROptionsType): Promise<string> => {
  try {
    const qrOptions = {
      width: options.width,
      margin: options.margin,
      color: {
        dark: options.color,
        light: options.backgroundColor,
      },
      errorCorrectionLevel: options.errorCorrectionLevel,
    };

    const svgString = await QRCode.toString(options.data, {
      ...qrOptions,
      type: 'svg',
    });
    
    return svgString;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw new Error('Failed to generate QR code SVG');
  }
};

/**
 * Add logo to QR code
 */
export const addLogoToQRCode = (
  qrDataUrl: string, 
  logoUrl: string, 
  size: number = 60
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const qrImage = new Image();
    qrImage.onload = () => {
      const logoImage = new Image();
      logoImage.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        canvas.width = qrImage.width;
        canvas.height = qrImage.height;

        ctx.drawImage(qrImage, 0, 0);

        const logoSize = size;
        const logoX = (canvas.width - logoSize) / 2;
        const logoY = (canvas.height - logoSize) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
        ctx.restore();

        resolve(canvas.toDataURL('image/png'));
      };
      logoImage.onerror = () => reject(new Error('Failed to load logo image'));
      logoImage.src = logoUrl;
    };
    qrImage.onerror = () => reject(new Error('Failed to load QR code image'));
    qrImage.src = qrDataUrl;
  });
};

/**
 * Download image or SVG
 */
export const downloadQRCode = (
  dataUrl: string, 
  fileName: string = 'qrcode', 
  fileType: 'png' | 'svg' = 'png'
): void => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = `${fileName}.${fileType}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Generate a Safe Scan badge
 */
export const generateSafeScanBadge = (
  qrDataUrl: string,
  badgeText: string = 'Safe Scan Verified'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const qrImage = new Image();
    qrImage.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const padding = 40;
      canvas.width = qrImage.width + padding * 2;
      canvas.height = qrImage.height + padding * 2 + 30;

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(qrImage, padding, padding);

      ctx.fillStyle = '#34D399';
      ctx.fillRect(padding, qrImage.height + padding + 10, qrImage.width, 20);

      ctx.font = 'bold 14px SF Pro Display, Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(badgeText, canvas.width / 2, qrImage.height + padding + 20);

      resolve(canvas.toDataURL('image/png'));
    };
    qrImage.onerror = () => reject(new Error('Failed to load QR code image'));
    qrImage.src = qrDataUrl;
  });
};
