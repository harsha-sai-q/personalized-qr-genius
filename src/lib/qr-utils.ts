import QRCode from 'qrcode';

export type QRStyleType = 'standard' | 'dots' | 'rounded' | 'classy' | 'edge-cut';

export interface QROptionsType {
  data: string;
  width?: number;
  color?: string;
  backgroundColor?: string;
  cornerRadius?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  style?: QRStyleType;
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
  style: 'standard',
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
    
    // Apply style transformations
    if (options.style && options.style !== 'standard') {
      return applyQRStyle(dataUrl, options.style);
    }
    
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
    
    // Apply style to SVG
    let styledSvg = svgString;
    
    if (options.style === 'dots') {
      styledSvg = applySvgDotStyle(svgString);
    } else if (options.style === 'rounded') {
      styledSvg = applyCornerRadius(svgString, 8);
    } else if (options.style === 'classy') {
      styledSvg = applySvgClassyStyle(svgString);
    } else if (options.style === 'edge-cut') {
      styledSvg = applySvgEdgeCutStyle(svgString);
    }
    
    return styledSvg;
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
  return svgString.replace(/<path\s+fill="([^"]+)"\s+d="M(\d+),(\d+)H(\d+)V(\d+)H(\d+)Z"\s*\/>/g, 
    (match, fill, x, y, x2, y2, x3) => {
      const width = Number(x2) - Number(x);
      const height = Number(y2) - Number(y);
      return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="${fill}" />`;
    }
  );
};

/**
 * Apply dots style to SVG
 */
const applySvgDotStyle = (svgString: string): string => {
  return svgString.replace(/<path\s+fill="([^"]+)"\s+d="M(\d+),(\d+)H(\d+)V(\d+)H(\d+)Z"\s*\/>/g, 
    (match, fill, x, y, x2, y2, x3) => {
      const width = Number(x2) - Number(x);
      const height = Number(y2) - Number(y);
      const centerX = Number(x) + width / 2;
      const centerY = Number(y) + height / 2;
      const radius = Math.min(width, height) / 2;
      return `<circle cx="${centerX}" cy="${centerY}" r="${radius}" fill="${fill}" />`;
    }
  );
};

/**
 * Apply classy style to SVG (rounded corners only at edges)
 */
const applySvgClassyStyle = (svgString: string): string => {
  // Extract width and height to determine if a path is at an edge
  const dimensions = svgString.match(/width="(\d+)" height="(\d+)"/);
  if (!dimensions) return applyCornerRadius(svgString, 5); // Fallback
  
  const svgWidth = parseInt(dimensions[1]);
  const moduleSize = svgWidth / 25; // Approximate size of each module
  const edgeThreshold = moduleSize * 3; // Consider modules within this distance from edge as "edge modules"

  return svgString.replace(/<path\s+fill="([^"]+)"\s+d="M(\d+),(\d+)H(\d+)V(\d+)H(\d+)Z"\s*\/>/g, 
    (match, fill, x, y, x2, y2, x3) => {
      const xNum = Number(x);
      const yNum = Number(y);
      const width = Number(x2) - xNum;
      const height = Number(y2) - yNum;
      
      // Check if module is at an edge
      const isAtTopEdge = yNum < edgeThreshold;
      const isAtLeftEdge = xNum < edgeThreshold;
      const isAtBottomEdge = yNum + height > svgWidth - edgeThreshold;
      const isAtRightEdge = xNum + width > svgWidth - edgeThreshold;
      
      // Apply different corner radiuses based on position
      let radius = 0;
      
      if ((isAtTopEdge && isAtLeftEdge) || 
          (isAtTopEdge && isAtRightEdge) || 
          (isAtBottomEdge && isAtLeftEdge) || 
          (isAtBottomEdge && isAtRightEdge)) {
        radius = 10; // Corner modules get larger radius
      } else if (isAtTopEdge || isAtLeftEdge || isAtBottomEdge || isAtRightEdge) {
        radius = 5; // Edge modules get small radius
      }
      
      if (radius > 0) {
        return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="${fill}" />`;
      } else {
        return match; // Keep original for inner modules
      }
    }
  );
};

/**
 * Apply edge-cut style to SVG
 */
const applySvgEdgeCutStyle = (svgString: string): string => {
  // Add a decorative border around the QR code
  const borderSvg = svgString.replace(
    /<svg([^>]*)>/, 
    '<svg$1><rect x="10" y="10" width="calc(100% - 20)" height="calc(100% - 20)" fill="none" stroke="currentColor" stroke-width="5" rx="15" ry="15"/>'
  );
  
  return applyCornerRadius(borderSvg, 3);
};

/**
 * Apply QR style to image data URL
 */
const applyQRStyle = async (dataUrl: string, style: QRStyleType): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // First draw the image
      ctx.drawImage(img, 0, 0);

      // Get image data to manipulate pixels
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data, width, height } = imageData;
      
      // Clear canvas to redraw with style
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#FFFFFF'; // Background
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate module size (approximate)
      const moduleSize = width / 25; // QR codes are typically 25x25 for content
      
      // Apply style based on type
      if (style === 'dots') {
        // Draw dots instead of squares
        for (let y = 0; y < height; y += moduleSize) {
          for (let x = 0; x < width; x += moduleSize) {
            const idx = (y * width + x) * 4;
            // If pixel is dark (QR module)
            if (data[idx] < 128) {
              const centerX = x + moduleSize / 2;
              const centerY = y + moduleSize / 2;
              const radius = moduleSize / 2 * 0.85; // Slightly smaller than module
              
              ctx.beginPath();
              ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
              ctx.fillStyle = '#000000';
              ctx.fill();
            }
          }
        }
      } else if (style === 'rounded') {
        // Draw rounded squares
        for (let y = 0; y < height; y += moduleSize) {
          for (let x = 0; x < width; x += moduleSize) {
            const idx = (y * width + x) * 4;
            // If pixel is dark (QR module)
            if (data[idx] < 128) {
              const cornerRadius = moduleSize / 4;
              
              ctx.beginPath();
              ctx.moveTo(x + cornerRadius, y);
              ctx.lineTo(x + moduleSize - cornerRadius, y);
              ctx.quadraticCurveTo(x + moduleSize, y, x + moduleSize, y + cornerRadius);
              ctx.lineTo(x + moduleSize, y + moduleSize - cornerRadius);
              ctx.quadraticCurveTo(x + moduleSize, y + moduleSize, x + moduleSize - cornerRadius, y + moduleSize);
              ctx.lineTo(x + cornerRadius, y + moduleSize);
              ctx.quadraticCurveTo(x, y + moduleSize, x, y + moduleSize - cornerRadius);
              ctx.lineTo(x, y + cornerRadius);
              ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
              ctx.closePath();
              
              ctx.fillStyle = '#000000';
              ctx.fill();
            }
          }
        }
      } else if (style === 'classy') {
        // Draw with special corners only at the edges
        const totalModules = Math.round(width / moduleSize);
        
        for (let yModule = 0; yModule < totalModules; yModule++) {
          for (let xModule = 0; xModule < totalModules; xModule++) {
            const x = xModule * moduleSize;
            const y = yModule * moduleSize;
            const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
            
            // If pixel is dark (QR module)
            if (data[idx] < 128) {
              const isCornerModule = 
                (xModule < 2 && yModule < 2) || // Top-left corner
                (xModule > totalModules - 3 && yModule < 2) || // Top-right corner
                (xModule < 2 && yModule > totalModules - 3) || // Bottom-left corner
                (xModule > totalModules - 3 && yModule > totalModules - 3); // Bottom-right corner
              
              const isEdgeModule = 
                xModule < 2 || yModule < 2 || xModule > totalModules - 3 || yModule > totalModules - 3;
              
              let cornerRadius = 0;
              if (isCornerModule) {
                cornerRadius = moduleSize / 2;
              } else if (isEdgeModule) {
                cornerRadius = moduleSize / 4;
              }
              
              if (cornerRadius > 0) {
                ctx.beginPath();
                ctx.moveTo(x + cornerRadius, y);
                ctx.lineTo(x + moduleSize - cornerRadius, y);
                ctx.quadraticCurveTo(x + moduleSize, y, x + moduleSize, y + cornerRadius);
                ctx.lineTo(x + moduleSize, y + moduleSize - cornerRadius);
                ctx.quadraticCurveTo(x + moduleSize, y + moduleSize, x + moduleSize - cornerRadius, y + moduleSize);
                ctx.lineTo(x + cornerRadius, y + moduleSize);
                ctx.quadraticCurveTo(x, y + moduleSize, x, y + moduleSize - cornerRadius);
                ctx.lineTo(x, y + cornerRadius);
                ctx.quadraticCurveTo(x, y, x + cornerRadius, y);
                ctx.closePath();
              } else {
                ctx.rect(x, y, moduleSize, moduleSize);
              }
              
              ctx.fillStyle = '#000000';
              ctx.fill();
            }
          }
        }
      } else if (style === 'edge-cut') {
        // First draw normal QR
        ctx.drawImage(img, 0, 0);
        
        // Then add decorative border
        const padding = moduleSize * 2;
        const innerWidth = width - padding * 2;
        const innerHeight = height - padding * 2;
        
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = moduleSize / 2;
        ctx.beginPath();
        ctx.roundRect(padding, padding, innerWidth, innerHeight, 15);
        ctx.stroke();
      }

      // Convert canvas to data URL
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.onerror = () => reject(new Error('Failed to load QR code image'));
    img.src = dataUrl;
  });
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
