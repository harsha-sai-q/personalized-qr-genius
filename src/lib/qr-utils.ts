
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

// Default options
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
    
    // Apply corner radius if specified
    if (options.cornerRadius && options.cornerRadius > 0) {
      return applyCornerRadius(svgString, options.cornerRadius);
    }
    
    return svgString;
  } catch (error) {
    console.error('Error generating QR code SVG:', error);
    throw new Error('Failed to generate QR code SVG');
  }
};

/**
 * Apply corner radius to QR code modules
 */
const applyCornerRadius = (svgString: string, radius: number): string => {
  // Replace square path elements with rounded rectangles
  // This is a simple implementation that would need to be refined in production
  return svgString.replace(/<path\s+fill="([^"]+)"\s+d="M(\d+),(\d+)H(\d+)V(\d+)H(\d+)Z"\s*\/>/g, 
    (match, fill, x, y, x2, y2, x3) => {
      const width = Number(x2) - Number(x);
      const height = Number(y2) - Number(y);
      return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="${fill}" />`;
    }
  );
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
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Set canvas dimensions to match QR code
        canvas.width = qrImage.width;
        canvas.height = qrImage.height;

        // Draw QR code
        ctx.drawImage(qrImage, 0, 0);

        // Calculate center position and size for logo
        const logoSize = size;
        const logoX = (canvas.width - logoSize) / 2;
        const logoY = (canvas.height - logoSize) / 2;

        // Create circular clipping path for logo
        ctx.save();
        ctx.beginPath();
        ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        // Draw logo
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
        ctx.restore();

        // Convert to data URL
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
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Add some padding to accommodate the badge
      const padding = 40;
      canvas.width = qrImage.width + padding * 2;
      canvas.height = qrImage.height + padding * 2 + 30; // Extra 30px for badge

      // Fill canvas with white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw QR code
      ctx.drawImage(qrImage, padding, padding);

      // Draw badge
      ctx.fillStyle = '#34D399'; // Green color for badge
      ctx.fillRect(padding, qrImage.height + padding + 10, qrImage.width, 20);

      // Draw badge text
      ctx.font = 'bold 14px SF Pro Display, Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(badgeText, canvas.width / 2, qrImage.height + padding + 20);

      // Convert to data URL
      resolve(canvas.toDataURL('image/png'));
    };
    qrImage.onerror = () => reject(new Error('Failed to load QR code image'));
    qrImage.src = qrDataUrl;
  });
};
