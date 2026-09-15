import React, { useMemo } from 'react';

export const AD_KEYS = {
  banner728x90: { key: 'ef3657a3bc84fdd49514881c7a0f2985', width: 728, height: 90 },
  banner320x50: { key: '213018fc376d1d755d3f369229feeab4', width: 320, height: 50 },
  skyscraper160x600: { key: '60801af66cf43fcef9620485242f6528', width: 160, height: 600 },
  halfPage160x300: { key: 'fc674a6c6593bb82c7a97c6406cc3c02', width: 160, height: 300 },
  banner468x60: { key: '285e8b7fa8cbb5e5ab0567df09ea99c9', width: 468, height: 60 },
  square300x250: { key: '5a455b32731ae8810a4d7a0386eac003', width: 300, height: 250 },
} as const;

interface AdProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

export const Ad: React.FC<AdProps> = ({ adKey, width, height, className = '' }) => {
  const srcDoc = useMemo(
    () => `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  html, body {
    margin: 0;
    padding: 0;
    overflow: hidden;
    width: ${width}px;
    height: ${height}px;
    background: transparent;
  }
</style>
</head>
<body>
<script type="text/javascript">
  atOptions = {
    'key': '${adKey}',
    'format': 'iframe',
    'height': ${height},
    'width': ${width},
    'params': {}
  };
</script>
<script type="text/javascript" src="https://www.highrevenueformat.com/${adKey}/invoke.js"></script>
</body>
</html>`,
    [adKey, width, height]
  );

  return (
    <div
      className={`flex justify-center items-center mx-auto overflow-hidden ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <iframe
        title={`ad-${adKey}`}
        srcDoc={srcDoc}
        width={width}
        height={height}
        scrolling="no"
        frameBorder={0}
        style={{
          border: 0,
          display: 'block',
          width: `${width}px`,
          height: `${height}px`,
        }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
      />
    </div>
  );
};